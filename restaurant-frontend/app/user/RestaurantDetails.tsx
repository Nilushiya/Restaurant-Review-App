import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { searchRestaurants } from "@/api/restaurantApi";
import { getReviewsByRestaurantId } from "@/api/reviewApi";
import { useAuth } from "@/context/AuthContext"; 
import { callApiWithToken } from "@/api/apiWrapper";

const API_BASE_URL = "http://172.20.106.209:8080/api/photos";

export default function RestaurantDetail() {
  const { restaurant } = useLocalSearchParams();
  const data = JSON.parse(restaurant);
  const router = useRouter();
  const { accessToken, refreshAccessToken } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [nearbyPage, setNearbyPage] = useState(1);

  const fullPhotoUrl =
    data.photos?.length > 0
      ? `${API_BASE_URL}/${data.photos[0].url}`.replace(/([^:]\/)\/+/g, "$1")
      : null;

  const loadReviews = async (page = 0) => {
    setLoadingReviews(true);
    try {
      const result = await callApiWithToken(
              (token) => getReviewsByRestaurantId(data.id, page,token),
              accessToken,
              refreshAccessToken
            );
      console.log("Reviews loaded:", result.content);
      setReviews(result.content || []);
      setTotalReviewPages(result.totalPages || 1);
      setReviewPage(page);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

const loadNearbyRestaurants = async (page = 1, append = false) => {
  if (loadingNearby) return;
  setLoadingNearby(true);
  try {
    const params = {
      page,
      size: 5,
      latitude: data.geoLocation.lat,
      longitude: data.geoLocation.lon,
      radius: 5, // 5km radius
    };
    const result = await searchRestaurants(params);

    const filtered = result.content?.filter(r => r.id !== data.id) || [];

    setNearbyRestaurants(prev =>
      append ? [...prev, ...filtered] : filtered
    );

    setNearbyPage(page);
    setTotalReviewPages(result.totalPages || 1);
  } catch (err) {
    console.error("Error loading nearby restaurants:", err);
  } finally {
    setLoadingNearby(false);
  }
};


  useEffect(() => {
    // loadReviews(0);
    loadNearbyRestaurants(1);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadReviews(0);
    }, [])
  );

  const goToRestaurant = (restaurant :any) => {
    router.push({
      pathname: "/user/RestaurantDetails",
      params: { restaurant: JSON.stringify(restaurant) },
    });
  };

  const handleWriteRevirew = (id: any) => {
    router.push({
      pathname: "/user/reviewForm",
      params: { restaurant: id },    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Restaurant Image */}
      {fullPhotoUrl && <Image source={{ uri: fullPhotoUrl }} style={styles.image} />}

      {/* Main Info */}
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.cuisine}>{data.cuisineType}</Text>
      <Text style={styles.rating}>⭐ {data.averageRating.toFixed(1)} ({data.totalReviews} reviews)</Text>

      <Text style={styles.address}>
        📍 {data.address.streetNumber} {data.address.streetName}, {data.address.city}, {data.address.country}
      </Text>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: data.geoLocation.lat,
          longitude: data.geoLocation.lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: data.geoLocation.lat,
            longitude: data.geoLocation.lon,
          }}
          title={data.name}
        />
      </MapView>

      {/* Add Review Button */}
      <TouchableOpacity style={styles.addReviewButton} onPress={() => handleWriteRevirew(data.id)}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.addReviewText}>Add Review</Text>
      </TouchableOpacity>

      {/* Reviews */}
      <Text style={styles.sectionTitle}>Reviews</Text>
      {loadingReviews ? (
        <ActivityIndicator color="#7a2802" size="large" />
      ) : reviews.length === 0 ? (
        <Text style={styles.noDataText}>No reviews yet.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const hasPhotos = item.photos && item.photos.length > 0;
            const photoUrl = hasPhotos
              ? `${API_BASE_URL}/${item.photos[0].url}`.replace(/([^:]\/)\/+/g, "$1")
              : null;

            // Create star icons based on rating
            const stars = Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < item.rating ? "star" : "star-outline"}
                size={16}
                color="#FFD700"
              />
            ));

            return (
              <View style={styles.reviewCard}>
                {/* Left side: reviewer info + content */}
                <View style={styles.reviewLeft}>
                  <Text style={styles.reviewerName}>
                     {item.writtenBy?.username}
                  </Text>
                  <Text style={styles.reviewText}>{item.content}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(item.datePosted).toLocaleDateString()}
                  </Text>
                  <View style={styles.ratingStars}>{stars}</View>
                </View>

                {/* Right side: optional review photo */}
                {photoUrl && (
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.reviewPhoto}
                    resizeMode="cover"
                  />
                )}
              </View>
            );
          }}

          horizontal={false}
          scrollEnabled={false}
        />
      )}

      {/* Nearby Restaurants */}
      <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
{loadingNearby && nearbyRestaurants.length === 0 ? (
  <ActivityIndicator color="#7a2802" size="large" />
) : (
  <FlatList
    data={nearbyRestaurants}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => {
      const hasPhotos = item.photos && item.photos.length > 0;
      const photoUrl = hasPhotos
        ? `${API_BASE_URL}/${item.photos[0].url}`.replace(/([^:]\/)\/+/g, "$1")
        : null;
      return (
        <TouchableOpacity style={styles.nearbyCard} onPress={() => goToRestaurant(item)}>
          {photoUrl && <Image source={{ uri: photoUrl }} style={styles.nearbyImage} />}
          <Text style={styles.nearbynearbyName}>{item.name}</Text>
          <Text style={styles.nearbycuisine}>{item.cuisineType}</Text>
          <Text style={styles.rating}>⭐ {Number(item.averageRating || 0).toFixed(1)}</Text>
        </TouchableOpacity>
      );
    }}
    onEndReachedThreshold={0.7} // when 70% scrolled, load more
    onEndReached={() => {
      if (!loadingNearby && nearbyPage < totalReviewPages) {
        loadNearbyRestaurants(nearbyPage + 1, true);
      }
    }}
    ListFooterComponent={
      loadingNearby ? <ActivityIndicator color="#7a2802" size="small" /> : null
    }
  />
)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 250 },
  name: { fontSize: 26, fontWeight: "bold", margin: 10, color: "#7a2802" },
  cuisine: { fontSize: 18, marginHorizontal: 10, color: "#444" },
  rating: { fontSize: 18, marginHorizontal: 10, marginBottom: 10 },
  address: { fontSize: 16, marginHorizontal: 10, color: "#555" },
  map: { height: 200, margin: 10, borderRadius: 10 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", margin: 10, color: "#7a2802" },
  reviewCard: {
  flexDirection: "row", // Align text & image side by side
  justifyContent: "space-between",
  alignItems: "flex-start",
  backgroundColor: "#fdf1ec",
  marginHorizontal: 10,
  marginVertical: 1,
  borderRadius: 10,
  padding: 5,
  paddingLeft:10,
  borderBottomWidth: 1,      
  borderBottomColor: "#ccc", 
},

reviewLeft: {
  flex: 1,
  paddingRight: 10,
},

reviewPhoto: {
  width: 85,
  height: 85,
  borderRadius: 10,
},

reviewerName: {
  fontWeight: "bold",
  color: "#7a2802",
  fontSize: 14,
},

ratingStars: {
  flexDirection: "row",
  // marginVertical: 4,
  marginTop: 6,
},

reviewText: {
  color: "#444",
  marginTop: 3,
  fontSize: 14,
},

reviewDate: {
  color: "#777",
  fontSize: 12,
  // marginTop: 4,
},

  noDataText: { textAlign: "center", color: "#777", marginVertical: 10 },
  nearbyCard: {
    width: 150,
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    marginBottom:20,
  },
  nearbyImage: { width: "100%", height: 100, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  nearbyName: { fontSize: 14, fontWeight: "bold", color: "#333", margin: 5 },
  nearbycuisine: { color: "#666", marginTop: 4 },
  nearbyrating: { color: "#a0522d", marginTop: 4, fontWeight: "bold" },
  addReviewButton: {
    flexDirection: "row",
    backgroundColor: "#7a2802",
    margin: 12,
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addReviewText: { color: "#fff", fontWeight: "bold", marginLeft: 6 },
});
