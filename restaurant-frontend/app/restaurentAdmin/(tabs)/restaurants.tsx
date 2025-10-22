import React, {useState,useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {View,Text,Image,FlatList,StyleSheet,TouchableOpacity,Alert,ActivityIndicator,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useMode } from "@/context/ModeContext";
import { getMyRestaurants, deleteRestaurant} from "@/api/restaurantApi";
import { callApiWithToken } from "@/api/apiWrapper";
import { useAuth } from "@/context/AuthContext";

const dayOrder = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const API_BASE_URL = 'http://172.20.106.209:8080/api/photos';
const formatTimeEntry = (entry: any): string => {
  if (!entry && entry !== 0) return "";
  if (typeof entry === "string") return entry;
  if (Array.isArray(entry)) return entry.join(", ");
  if (typeof entry === "object") {
    const start = entry.open ?? entry.start ?? "";
    const end = entry.close ?? entry.end ?? "";
    if (start && end) return `${start} — ${end}`;
    if (start || end) return start || end;
    const parts = Object.entries(entry)
      .map(([k,v]) => `${cap(k)}: ${formatTimeEntry(v)}`)
      .filter(Boolean);
    return parts.join("; ");
  }
  return String(entry);
};
const formatOperatingHours = (hoursObj: any) => {
  if (!hoursObj || typeof hoursObj !== "object") return null;
  const lines = dayOrder
    .map(d => hoursObj[d] ? `${cap(d)}: ${formatTimeEntry(hoursObj[d])}` : null)
    .filter(Boolean);
  return lines.join("\n");
};
const getTodayHours = (hoursObj: any) => {
  if (!hoursObj || typeof hoursObj !== "object") return null;
  const today = dayOrder[new Date().getDay()];
  return formatTimeEntry(hoursObj[today]) || null;
};
const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setIsEditMode } = useMode();
  const { accessToken, refreshAccessToken } = useAuth();

  useFocusEffect(
  useCallback(() => {
    fetchRestaurants();
  }, []));

  const fetchRestaurants = async () => {
    try {
      const result = await callApiWithToken(
        (token) => getMyRestaurants(token),
        accessToken,
        refreshAccessToken
      );
      if(result === null) {
        setRestaurants([]);
        setLoading(false);
        return;
      }
      if (!Array.isArray(result)) {
        setRestaurants([]);
        setLoading(false);
        return;
      }
      setRestaurants(result);
      } catch (error: any) {
        Alert.alert("Erroro", error?.message || "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };
    
  const handleDelete = (id: string) => {
    Alert.alert("Delete Restaurant", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          const status = await callApiWithToken(
            (token) => deleteRestaurant(id, token),
            accessToken,
            refreshAccessToken
          );
          if(status == 204){
            Alert.alert("Success", "Restaurant deleted");
          }
          fetchRestaurants(); 
        } catch (error) {
          Alert.alert("Error", "Failed to delete restaurant");
        }
      },
    },
  ]);
};

  const handleEdit = (restaurant: any) => {
    setIsEditMode(true);
    router.push({
      pathname: "/restaurentAdmin/restaurantForm",
      params: { restaurant: JSON.stringify(restaurant) },
    });
  };

  const renderRestaurant = ({ item }: any) => {
    const hoursObj = item?.operatingHours ?? {};
    const weekly = formatOperatingHours(hoursObj);
    const today = getTodayHours(hoursObj);

    return (
      <View style={styles.card}>
        {item?.photos?.[0]?.url ? (
      <>
        {(() => {
          const fullPhotoUrl = `${API_BASE_URL}/${item.photos[0].url}`.replace(/([^:]\/)\/+/g, "$1");
          console.log("📸 Final Image URL:", fullPhotoUrl);

          fetch(fullPhotoUrl)
            .then(res => console.log("Fetch Status:", res.status))
            .catch(err => console.error("Fetch Error:", err));

          return (
            <Image
              source={{ uri: fullPhotoUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          );
        })()}
      </>
      ) : null}

        <View style={styles.row}>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item?.name?.trim() || "Unnamed"}</Text>
            <Text style={styles.cuisine}>{item?.cuisineType?.trim() || "Unknown cuisine"}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.contact}>📞 {item?.contactInformation || "N/A"}</Text>
              <Text style={styles.addressShort}>
                📍 {item?.address?.streetNumber || ""} {item?.address?.streetName || ""} • {item?.address?.city || ""}
              </Text>
            </View>

            <View style={styles.todayRow}>
              <Text style={styles.hoursLabel}>🕒 Today:</Text>
              <Text style={[styles.hoursToday, !today && styles.hoursUnavailable]}>{today || "Not available"}</Text>
            </View>

            {weekly ? (
              <View style={styles.weeklyContainer}>
                <Text style={styles.hoursTitle}>Weekly Hours</Text>
                {dayOrder.map(day => {
                  const timeEntry = formatTimeEntry(hoursObj[day]);
                  if (!timeEntry) return null;
                  const isToday = day === dayOrder[new Date().getDay()];
                  return (
                    <View key={day} style={[styles.weeklyRow, isToday && styles.todayRowHighlight]}>
                      <Text style={[styles.weekDay, isToday && styles.todayText]}>{cap(day)}</Text>
                      <Text style={[styles.weekTime, isToday && styles.todayText]}>{timeEntry}</Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.hoursText}>🕒 Operating hours not available</Text>
            )}
          </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
              <FontAwesome name="pencil" size={22} color="#2e7d32" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item?.id)} style={styles.iconButton}>
              <FontAwesome name="trash" size={22} color="#c62828" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading restaurants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {restaurants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No restaurants found.</Text>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
          renderItem={renderRestaurant}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default Restaurants;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", paddingTop: 20 },
  list: { paddingHorizontal: 12, paddingBottom: 24 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666" },
  card: { backgroundColor: "#fff", borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, marginVertical: 8, overflow: "hidden" },
  image: { width: "100%", height: 250 },
  row: { flexDirection: "row", padding: 12, alignItems: "flex-start" },
  infoContainer: { flex: 1, paddingRight: 8 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 },
  iconContainer: { justifyContent: "space-between", paddingLeft: 6 },
  iconButton: { padding: 6 },
  name: { fontSize: 18, fontWeight: "700", color: "#111" },
  cuisine: { fontSize: 14, color: "#666", marginTop: 2 },
  contact: { fontSize: 13, color: "#444" },
  addressShort: { fontSize: 13, color: "#666", marginLeft: 10 },
  todayRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  hoursLabel: { fontSize: 13, fontWeight: "600", marginRight: 6 },
  hoursToday: { fontSize: 13, color: "#2e7d32", fontWeight: "600" },
  hoursUnavailable: { color: "#999", fontWeight: "400" },
  weeklyContainer: { marginTop: 8, padding: 10, backgroundColor: "#e8f5e9", borderRadius: 12, borderWidth: 1, borderColor: "#ecb040ff" },
  weeklyRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, paddingHorizontal: 6 },
  weekDay: { fontSize: 13, color: "#333", fontWeight: "600" },
  weekTime: { fontSize: 13, color: "#555" },
  todayRowHighlight: { backgroundColor: "#e27d09ff", borderRadius: 6, marginVertical: 2 },
  todayText: { fontWeight: "700", color: "#b88311ff" },
  hoursText: { fontSize: 13, color: "#444", lineHeight: 20 },
});
