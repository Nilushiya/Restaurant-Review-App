import axios from "axios";
import Config from "react-native-config";
import { encode } from 'base64-arraybuffer';

  const API_BASE_URL = 'http://172.20.106.209:8080/api/photos';

export const uploadPhotos = async (files: string[], token: string) => {
console.log("API_BASE_URL:", API_BASE_URL);
  const formData = new FormData();

  console.log("Files to upload:", files  , "token : ", token);

  // Append each file to the FormData with key "files"
  files.forEach((fileUri, index) => {
    const fileName = fileUri.split("/").pop() || `photo_${index}.jpg`;
    const file = {
      uri: fileUri,
      type: "image/jpeg", // You can detect MIME type if needed
      name: fileName,
    };
    formData.append("files", file);
  });
console.log("FormData prepared:", formData);
  try {
    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Upload response:", response.data);
    if(response.status === 401){
       Alert.alert("Error", "Jwt expired");
      throw new Error("Jwt expired");  
    }
    return response.data; // Expecting [{ url, uploadDate }, ...]
  } catch (error:  any) {
    console.error("Error uploading photos:", error.response?.data || error);
    throw error;
  }
};

export const getPhotos = async (token: string, photoId: string) => {
  console.log("Fetching photo with ID:", photoId);
  try {
    const response = await axios.get(`${API_BASE_URL}/${photoId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "arraybuffer",
    });

    const base64 = encode(response.data);
    const contentType = response.headers["content-type"] || "image/png";

    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Error fetching photo:", error);
    return null;
  }
};

export const deletePhoto = async (token: string, photoId: string) => {
  console.log("Deleting photo with ID:", photoId);
  try {
    const response = await axios.delete(`${API_BASE_URL}/${photoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 204) {
      return response.status;
    }
    if(response.status === 401){
       Alert.alert("Error", "Jwt expired");
      throw new Error("Jwt expired");  
    }
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw error;
  }
}