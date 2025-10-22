import React, { useState, useEffect ,useLayoutEffect} from "react";
import {View,Text,TextInput,TouchableOpacity,Image,ScrollView,Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from '@expo/vector-icons';
import { createRestaurant, updateRestaurant} from "../../api/restaurantApi";
import { useAuth } from "@/context/AuthContext";
import { callApiWithToken } from "@/api/apiWrapper";
import { uploadPhotos, deletePhoto } from "@/api/photoApi";
import { useLocalSearchParams } from "expo-router";
import { useMode } from "@/context/ModeContext";
import { useNavigation } from "@react-navigation/native";

export default function RestaurantForm() {
  const { accessToken, refreshAccessToken} = useAuth();
  const { restaurant } = useLocalSearchParams();
  const { isEditMode} = useMode();
  const navigation = useNavigation();
  const API_BASE_URL = 'http://172.20.106.209:8080/api/photos';
  const [previews, setPreviews] = useState<{ localUri: string; uploadedUrl: string }[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    cuisineType: string;
    contactInformation: string;
    address: {
      streetNumber: string;
      streetName: string;
      unit: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    operatingHours: {
      monday: { openTime: string; closeTime: string };
      tuesday: { openTime: string; closeTime: string };
      wednesday: { openTime: string; closeTime: string };
      thursday: { openTime: string; closeTime: string };
      friday: { openTime: string; closeTime: string };
      saturday: { openTime: string; closeTime: string };
      sunday: { openTime: string; closeTime: string };
    };
    photoIds: string[];
  }>({
    name: "",
    cuisineType: "",
    contactInformation: "",
    address: {
      streetNumber: "",
      streetName: "",
      unit: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    operatingHours: {
      monday: { openTime: "", closeTime: "" },
      tuesday: { openTime: "", closeTime: "" },
      wednesday: { openTime: "", closeTime: "" },
      thursday: { openTime: "", closeTime: "" },
      friday: { openTime: "", closeTime: "" },
      saturday: { openTime: "", closeTime: "" },
      sunday: { openTime: "", closeTime: "" },
    },
    photoIds: [],
  });
  let parsed: any = {};
  if (restaurant) {
    try {
      parsed = typeof restaurant === "string" ? JSON.parse(restaurant) : restaurant;
    } catch (err) {
      console.error("Failed to parse restaurant param:", err);
      parsed = {};
    }
  }
  useEffect(() => {
  if (restaurant) {
    console.log("Editing restaurant:", restaurant);
    try {
      setFormData({
        name: parsed.name || "",
        cuisineType: parsed.cuisineType || "",
        contactInformation: parsed.contactInformation || "",
        address: {
          streetNumber: parsed.address?.streetNumber || "",
          streetName: parsed.address?.streetName || "",
          unit: parsed.address?.unit || "",
          city: parsed.address?.city || "",
          state: parsed.address?.state || "",
          postalCode: parsed.address?.postalCode || "",
          country: parsed.address?.country || "",
        },
        operatingHours: parsed.operatingHours || {
          monday: { openTime: "", closeTime: "" },
          tuesday: { openTime: "", closeTime: "" },
          wednesday: { openTime: "", closeTime: "" },
          thursday: { openTime: "", closeTime: "" },
          friday: { openTime: "", closeTime: "" },
          saturday: { openTime: "", closeTime: "" },
          sunday: { openTime: "", closeTime: "" },
        },
        photoIds: parsed.photos?.map((photo: any) => photo.url) || [],
      });

       if (parsed.photos?.length) {
        const fetchPhotos = async () => {
      try {
              const fullPhotoUrl = `${API_BASE_URL}/${parsed.photos[0].url}`.replace(/([^:]\/)\/+/g, "$1");
              const res = await fetch(fullPhotoUrl);
              if (!res.ok) throw new Error("Failed to fetch photo: " + parsed.photos[0].url);
              setPreviews([{ localUri: res.url, uploadedUrl: parsed.photos[0].url }]);
          } catch (err) {
            console.error("Error fetching photos:", err);
          }
        };

        fetchPhotos();
      }
    } catch (err) {
      console.error("Failed to parse restaurant param:", err);
    }
  }
}, [restaurant]);

    useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: isEditMode ? "Edit Restaurant" : "Add Restaurant",
    });
  }, [isEditMode]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [timePicker, setTimePicker] = useState<{
    day: string | null;
    field: "openTime" | "closeTime" | null;
    show: boolean;
  }>({ day: null, field: null, show: false });

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: "" });
  };

  const handleAddressChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      address: { ...formData.address, [key]: value },
    });
    setErrors({ ...errors, [key]: "" });
  };

  const handleTimeChange = (day: string, field: "openTime" | "closeTime", value: Date) => {
    const timeString = value.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [day]: { ...formData.operatingHours[day], [field]: timeString },
      },
    });
  };

const pickImages = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (!result.canceled) {
    const selectedUris = result.assets.map((asset) => asset.uri);

    try {
      const uploadedPhotos = await callApiWithToken(
        (token) => uploadPhotos(selectedUris, token),
        accessToken,
        refreshAccessToken
      );

      const uploadedUrls = uploadedPhotos.map((photo: any) => photo.url);
      const combined = selectedUris.map((uri, index) => ({
        localUri: uri,
        uploadedUrl: uploadedUrls[index],
      }));
      setPreviews((prev) => [...prev, ...combined]);
      setFormData({
        ...formData,
        photoIds: [...formData.photoIds, ...uploadedUrls],
      });
      setErrors({ ...errors, photoIds: "" });
    } catch (error: any) {
      Alert.alert("Photo Upload Error", error.message);
    }
  }
};

  const removePhoto = async(index: number, photo_id: string) => {
    console.log("Removing photo with ID:", index, photo_id);
    try {
      const deletePhotos = await callApiWithToken(
        (token) => deletePhoto(token, photo_id),
        accessToken,
        refreshAccessToken
      );
      if(deletePhotos === 204) console.log("Photo deleted successfully:", deletePhotos);
    } catch (error: any) {
      Alert.alert("Photo Upload Error", error.message);
    }
    setPreviews([]);
    setFormData({ ...formData, photoIds: [] });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Restaurant name is required.";
    if (!formData.cuisineType.trim()) newErrors.cuisineType = "Cuisine type is required.";
    if (!formData.contactInformation.trim())
      newErrors.contactInformation = "Contact information is required.";

    const { streetNumber, streetName, city, state, postalCode, country } = formData.address;
    if (!streetNumber) newErrors.streetNumber = "Street number is required.";
    if (!streetName) newErrors.streetName = "Street name is required.";
    if (!city) newErrors.city = "City is required.";
    if (!state) newErrors.state = "State is required.";
    if (!postalCode) newErrors.postalCode = "Postal code is required.";
    if (!country) newErrors.country = "Country is required.";

    if (formData.photoIds.length === 0) newErrors.photoIds = "Please upload at least one photo.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors before submitting.");
      return;
    }
     if (isEditMode) {
    const original = parsed;

    const originalData = {
      ...original,
      photos: original.photos?.map((p: any) => p.url) || [],
    };
    const currentData = {
      ...formData,
      photos: formData.photoIds || [],
    };

    if (JSON.stringify(originalData) === JSON.stringify(currentData)) {
      Alert.alert("No changes detected", "You did not change anything.");
      return;
    }
  }

    try {
  const response = await callApiWithToken(
  isEditMode
    ? (token) => {
        console.log("Clicked update");
        return updateRestaurant(parsed.id, formData, token);
      }
    : (token) => {
        console.log("Clicked add");
        return createRestaurant(formData, token);
      },
  accessToken,
  refreshAccessToken
);

  if(response == 200){
    Alert.alert("Success", isEditMode  ? "Restaurant updated successfully!" : "Restaurant created successfully!");
      setFormData({
        name: "",
        cuisineType: "",
        contactInformation: "",
        address: {
          streetNumber: "",
          streetName: "",
          unit: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
        operatingHours: {
          monday: { openTime: "", closeTime: "" },
          tuesday: { openTime: "", closeTime: "" },
          wednesday: { openTime: "", closeTime: "" },
          thursday: { openTime: "", closeTime: "" },
          friday: { openTime: "", closeTime: "" },
          saturday: { openTime: "", closeTime: "" },
          sunday: { openTime: "", closeTime: "" },
        },
        photoIds: [],
      });
      setPreviews([]);
      setErrors({});}
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const daysOfWeek = Object.keys(formData.operatingHours);

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#f3efefff", paddingBottom: 70 }}>
      <Text style={styles.sectionTitle}>Basic Information</Text>

      <Text style={styles.label}>Restaurant Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.label}>Cuisine Type</Text>
      <TextInput
        style={styles.input}
        value={formData.cuisineType}
        onChangeText={(text) => handleChange("cuisineType", text)}
      />
      {errors.cuisineType && <Text style={styles.errorText}>{errors.cuisineType}</Text>}

      <Text style={styles.label}>Contact Information</Text>
      <TextInput
        style={styles.input}
        value={formData.contactInformation}
        onChangeText={(text) => handleChange("contactInformation", text)}
      />
      {errors.contactInformation && <Text style={styles.errorText}>{errors.contactInformation}</Text>}

      <Text style={styles.sectionTitle}>Restaurant Photos</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>{isEditMode ? "Update Photos" : "Select Photos"}</Text>
      </TouchableOpacity>
      {errors.photoIds && <Text style={styles.errorText}>{errors.photoIds}</Text>}

      <View style={styles.photoGrid}>
         {previews.map((photo, index) => (
          <View key={index} style={styles.photoItem}>
            <Image source={{ uri: photo.localUri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePhoto(index, photo.uploadedUrl)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Address</Text>
      {Object.keys(formData.address).map((key) => (
        <View key={key}>
          <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          <TextInput
            style={styles.input}
            value={(formData.address as any)[key]}
            onChangeText={(text) => handleAddressChange(key, text)}
          />
          {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Operating Hours</Text>
      {daysOfWeek.map((day) => (
        <View key={day} style={styles.dayRow}>
          <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>

          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setTimePicker({ day, field: "openTime", show: true })}
          >
            <Ionicons name="time-outline" size={18} color="#333" style={{ marginRight: 5 }} />
            <Text style={styles.timeText}>
              {formData.operatingHours[day].openTime || "Open Time"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setTimePicker({ day, field: "closeTime", show: true })}
          >
            <Ionicons name="time-outline" size={18} color="#333" style={{ marginRight: 5 }} />
            <Text style={styles.timeText}>
              {formData.operatingHours[day].closeTime || "Close Time"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {timePicker.show && timePicker.day && timePicker.field && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          onChange={(event, selectedDate) => {
            if (event.type === "set" && selectedDate && timePicker.day && timePicker.field) {
              handleTimeChange(timePicker.day, timePicker.field, selectedDate);
            }
            setTimePicker({ day: null, field: null, show: false });
          }}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>{isEditMode ? "Update Restaurant" : "Submit Restaurant"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 15 },
  label: { fontSize: 14, marginBottom: 5, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  dayLabel: { width: 100, fontWeight: "bold" },
  timeButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginHorizontal: 1,
    marginVertical: 1,
    minWidth: 120,
    alignItems: "center",
  },
  timeText: { color: "#333" },
  uploadButton: {
    backgroundColor: "#c45a03",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoItem: { position: "relative", width: 100, height: 100, margin: 5 },
  photo: { width: "100%", height: "100%", borderRadius: 8 },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#c45a03",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 50,
  },
  errorText: { color: "red", fontSize: 12, marginBottom: 5 },
};
