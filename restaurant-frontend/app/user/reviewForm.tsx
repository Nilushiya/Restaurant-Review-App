import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createReview } from '@/api/reviewApi';
import { useAuth } from '@/context/AuthContext';
import { callApiWithToken } from '@/api/apiWrapper';
import { uploadPhotos } from '@/api/photoApi';
import { useLocalSearchParams } from 'expo-router';


export default function ReviewForm() {
  const params = useLocalSearchParams();
  const restaurantId = params.restaurant;
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [previews, setPreviews] = useState<{ localUri: string; uploadedUrl: string }[]>([]);
  const [errors, setErrors] = useState<{ content?: string; rating?: string; photoIds?: string }>({});

  const { accessToken, refreshAccessToken } = useAuth();

  // Pick and upload images
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
        setPhotoIds((prev) => [...prev, ...uploadedUrls]);

        // Clear photo error
        setErrors((prev) => ({ ...prev, photoIds: '' }));
      } catch (error: any) {
        Alert.alert('Photo Upload Error', error.message);
      }
    }
  };

  // Validate fields
  const validateForm = () => {
    let valid = true;
    const newErrors: typeof errors = {};

    if (!content.trim()) {
      newErrors.content = 'Review content is required';
      valid = false;
    }

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
      valid = false;
    }

    if (photoIds.length === 0) {
      newErrors.photoIds = 'Please add at least one photo';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const reviewData = { content, rating, photoIds };
      const restaurant_id = restaurantId.replace(/"/g, '');
      const createdReview = await createReview(restaurant_id, reviewData, accessToken);
      console.log('Review created:', createdReview);
      Alert.alert('Success', 'Review created successfully!');
      setContent('');
      setRating(0);
      setPhotoIds([]);
      setPreviews([]);
      setErrors({});
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create review');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ marginBottom: 8 }}>Your Photos:</Text>
      <ScrollView horizontal style={{ marginBottom: 8 }}>
        {previews.map((p, index) => (
          <Image key={index} source={{ uri: p.localUri }} style={{ width: 80, height: 80, marginRight: 8, borderRadius: 8 }} />
        ))}
        <TouchableOpacity
          onPress={pickImages}
          style={{
            width: 80,
            height: 80,
            backgroundColor: '#eee',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
          }}
        >
          <Text>+</Text>
        </TouchableOpacity>
      </ScrollView>
      {errors.photoIds ? <Text style={{ color: 'red', marginBottom: 8 }}>{errors.photoIds}</Text> : null}

      <Text style={{ marginBottom: 8 }}>Rating:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={{ fontSize: 32, color: star <= rating ? '#f1c40f' : '#ccc' }}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.rating ? <Text style={{ color: 'red', marginBottom: 8 }}>{errors.rating}</Text> : null}

      <TextInput
        placeholder="Write your review..."
        value={content}
        onChangeText={setContent}
        multiline
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, minHeight: 100, marginBottom: 8 }}
      />
      {errors.content ? <Text style={{ color: 'red', marginBottom: 8 }}>{errors.content}</Text> : null}

      <Button title="Submit Review" onPress={handleSubmit} />
    </ScrollView>
  );
}
