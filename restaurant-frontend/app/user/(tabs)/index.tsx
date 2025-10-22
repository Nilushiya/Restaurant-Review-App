import { Link, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
// import useTheme from "@/hooks/useTheme";
import { ImageBackground,Image, StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { searchRestaurants } from "@/api/restaurantApi";
import React from "react";
import { useRouter } from "expo-router";

const API_BASE_URL = 'http://172.20.106.209:8080/api/photos';

export default function Index() {
  // const {toggleDarkMode} = useTheme();
    // Restaurant states
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Search/filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(null);

  // Load restaurants function
  const loadRestaurants = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const params :any = { page: pageNumber, size };
      if (searchQuery) params.q = searchQuery;
      if (minRating) params.minRating = minRating;
      if (latitude && longitude && radius) {
        params.latitude = latitude;
        params.longitude = longitude;
        params.radius = radius;
      }

      const data = await searchRestaurants(params);
      setRestaurants(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
useFocusEffect(
  React.useCallback(() => {
    loadRestaurants(1);
  }, [])
);

  const handleSearch = () => {
    if(searchQuery.trim() === ""){
      alert("Please enter a search query.");
      return;
    }
    loadRestaurants(1);
    setSearchQuery('')
  };

  const renderRestaurant = ({ item }) => {
  const hasPhotos = item.photos && item.photos.length > 0;
  const fullPhotoUrl = hasPhotos
    ? `${API_BASE_URL}/${item.photos[0].url}`.replace(/([^:]\/)\/+/g, "$1")
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/user/RestaurantDetails",
          params: { restaurant: JSON.stringify(item) }, 
        })}
    >
      {fullPhotoUrl ? (
        <Image source={{ uri: fullPhotoUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ color: "#fff" }}>No image</Text>
        </View>
      )}

      <View style={{ paddingTop: 8 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.cuisine}>{item.cuisineType}</Text>
        <Text style={styles.rating}>⭐ {Number(item.averageRating || 0).toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );
};

  const renderPagination = () => {
  const maxPagesToShow = 5; 
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <View style={styles.paginationContainer}>
      {/* Previous Button */}
      <TouchableOpacity
        style={styles.pageButton}
        onPress={() => page > 1 && loadRestaurants(page - 1)}
        disabled={page === 1}
      >
        <Text style={styles.pageText}>‹</Text>
      </TouchableOpacity>

      {/* Page Numbers */}
      {pages.map((p) => (
        <TouchableOpacity
          key={p}
          style={[styles.pageButton, p === page && styles.activePage]}
          onPress={() => loadRestaurants(p)}
        >
          <Text style={[styles.pageText, p === page && styles.activePageText]}>
            {p}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Next Button */}
      <TouchableOpacity
        style={styles.pageButton}
        onPress={() => page < totalPages && loadRestaurants(page + 1)}
        disabled={page === totalPages}
      >
        <Text style={styles.pageText}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

  
  return (
  <View style={{ flex: 1 }}>
    {/* Banner */}
    <ImageBackground
      source={require("../../../assets/images/home-bg.jpg")}
      style={{ width: "100%", height: 200, justifyContent: "center", alignItems: "flex-start" }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(122, 40, 2, 0.9)", "transparent"]}
        style={StyleSheet.absoluteFillObject}
      />
      <Text style={styles.textMain}>Discover Your Next Favorite Restaurant</Text>
      <Text style={styles.textSub}>
        Read authentic reviews from real diners and find the perfect spot for your next meal.
      </Text>
    </ImageBackground>

    {/* Search */}
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search ..."
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Ionicons name="search" size={22} color="#fff" />
      </TouchableOpacity>
    </View>

    {/* Restaurant list */}
    {loading ? (
      <ActivityIndicator size="large" color="#7a2802" style={{ marginTop: 330 }} />
    ) : (
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRestaurant}
        ListEmptyComponent={<Text style={styles.noDataText}>No restaurants found.</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    )}

    {/* Pagination */}
    {totalPages > 1 && renderPagination()}
  </View>
);

}

const styles = StyleSheet.create({
  container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
   background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
   gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textMain: {
    // position: "absolute",
    // top: 140,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft:20,
  },
  textSub: {
    // position: "absolute",
    // top: 200,
    color: "white",
    fontSize: 15,
    backgroundColor:"black",
    margin:20,
    opacity:0.7,
    padding:10,
    marginTop:10,
    borderRadius:10,
  },
  searchContainer: { flexDirection: "row", marginHorizontal: 16,marginTop:20,  backgroundColor: "#fff", borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, alignItems: "center" },
  searchInput: { flex: 1, padding: 10, fontSize: 16, color: "#333" },
  searchButton: { backgroundColor: "#7a2802", padding: 10, borderTopRightRadius: 8, borderBottomRightRadius: 8, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 15, marginHorizontal: 16, marginVertical: 8, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },

  image: { width: "100%", height: 150, borderRadius: 8, marginBottom: 8 },

  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cuisine: { color: "#666", marginTop: 4 },
  rating: { color: "#a0522d", marginTop: 4, fontWeight: "bold" },
  noDataText: { textAlign: "center", marginTop: 30, color: "#888" },
  paginationContainer: { flexDirection: "row", justifyContent: "center", paddingVertical: 12, flexWrap: "wrap" },
  pageButton: { paddingVertical: 6, paddingHorizontal: 12, margin: 4, backgroundColor: "#eee", borderRadius: 6 },
  activePage: { backgroundColor: "#7a2802" },
  pageText: { fontSize: 16, color: "#333" },
  activePageText: { color: "#fff", fontWeight: "bold" },
});
