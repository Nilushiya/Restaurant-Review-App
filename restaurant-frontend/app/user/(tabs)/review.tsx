import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRestaurantsWithUserReviews } from "@/api/reviewApi";
import { useAuth } from "@/context/AuthContext";

const ReviewScreen = () => {
  const { accessToken } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const fetchData = async () => {
      const data = await getRestaurantsWithUserReviews(accessToken);
      setRestaurants(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderReview = ({ item }) => {
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
        {/* Top: Reviewer + Stars */}
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewerName}>
            {item.writtenBy?.username || "Anonymous"}
          </Text>
          <View style={styles.ratingStars}>{stars}</View>
        </View>

        {/* Content */}
        <Text style={styles.reviewContent}>{item.content}</Text>

        {/* Bottom: Date + Photos (left) / Edit & Delete (right) */}
        <View style={styles.reviewFooter}>
          <View style={styles.leftSection}>
            <Text style={styles.reviewDate}>
              {new Date(item.datePosted).toLocaleDateString()}
            </Text>

            {/* Review Photos */}
            {item.photos && item.photos.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.photoContainer}
              >
                {item.photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{
                      uri: `http://172.20.106.209:8080/api/photos/${photo.url}`.replace(
                        /([^:]\/)\/+/g,
                        "$1"
                      ),
                    }}
                    style={styles.reviewPhoto}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* Right side: Edit / Delete icons */}
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={() => console.log("Edit", item.id)}>
              <Ionicons name="pencil" size={20} color="#007AFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => console.log("Delete", item.id)}
              style={{ marginTop: 10 }}
            >
              <Ionicons name="trash" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderRestaurant = ({ item }) => (
    <View style={styles.restaurantCard}>
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantCuisine}>{item.cuisineType}</Text>
      <Text style={styles.restaurantRating}>
        Avg. Rating: {item.averageRating?.toFixed(1) || "N/A"} ⭐
      </Text>

      {item.userReviews.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Your Reviews:</Text>
          <FlatList
            data={item.userReviews}
            keyExtractor={(review) => review.id}
            renderItem={renderReview}
            scrollEnabled={false}
          />
        </>
      )}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={restaurants}
      keyExtractor={(item) => item.id}
      renderItem={renderRestaurant}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>No reviews found.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f3f3ff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  restaurantCard: {
    backgroundColor: "#fcfcfcff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  restaurantRating: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  reviewCard: {
    backgroundColor: "#fdf1ec",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  reviewerName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  reviewContent: {
    fontSize: 14,
    marginBottom: 5,
    color: "#444",
  },
  ratingStars: {
    flexDirection: "row",
  },
  reviewDate: {
    fontSize: 10,
    color: "#888",
    marginBottom: 5,
  },
  photoContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  reviewPhoto: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#ddd",
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 5,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default ReviewScreen;
