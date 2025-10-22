import { Alert } from 'react-native';
import Config from 'react-native-config'

const API_BASE_URL = 'http://172.20.106.209:8080/api/restaurants';

export const createRestaurant = async (data: any, accessToken:String) => {
    console.log("hi",Config.API_URL);
    console.log('Creating restaurant with data:', data, 'and accessToken:', accessToken);
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
      },
      body: JSON.stringify(data),
    });
    console.log('API response status:', response.status, response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create restaurant");
    }
    if(response.status === 401){
       Alert.alert("Error", "Jwt expired");
      throw new Error("Jwt expired");  
    }
    // if(response.status === 200){
    //   Alert.alert("Success", "Restaurant created");
    // }
    return await response.status;
  } catch (error: any) {
    throw new Error(error.message || "Network error");
  }
};

export const getMyRestaurants = async (accessToken:String) => {
  console.log('Fetching restaurants with accessToken:', accessToken);
  try {
    const response = await fetch(`${API_BASE_URL}/restaurantByOwner`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
      },
    });
    console.log('API response status:', response.status, response);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch restaurants");
    }
    if(response.status === 401){
       Alert.alert("Error", "Jwt expired");
      throw new Error("Jwt expired");  
    }
    if (response.status === 204) {
      console.log('No content returned from API');
      return []; // Return an empty array if no content
    }

    const data = await response.json(); // ✅ extract the actual JSON data
    console.log('Fetched restaurants:', data);
    return data;
 
}catch (error: any) {
    throw new Error(error.message || "Network error");
  }
};

export const deleteRestaurant = async (id: string, accessToken:String) => {
  console.log('Deleting restaurant with id:', id, 'and accessToken:', accessToken);
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
      },
    });
    console.log('API response status:', response.status, );
    if(response.status === 401){
       Alert.alert("Error", "Jwt expired");
      throw new Error("Jwt expired");  
    }
    return response.status; 
  }
  catch (error: any) {
      throw new Error(error.message || "Network error");
    }
};

export const updateRestaurant = async (id: string, data: any, accessToken:String) => {
  console.log('Updating restaurant with id:', id, 'data:', data, 'and accessToken:', accessToken);
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
      }, 
      body: JSON.stringify(data),
    });
    console.log('API response status:', response.status, response); 
    // if(response.status === 200){
    //   Alert.alert("Success", "Restaurant updated");
    // }
    if(response.status === 401){
       Alert.alert("Error", "Jwt expired");
      throw new Error("Jwt expired");  
    }
    return response.status;
  }
  catch (error: any) {
      throw new Error(error.message || "Network error");
    }
  };

export const searchRestaurants = async (param: {
  q?: string;
  minRating?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  size?: number;
} = {}) => {
  try {
    const queryString = new URLSearchParams(
      Object.fromEntries(
        Object.entries(param).map(([key, value]) => [key, String(value)])
      )
    ).toString();
    // console.log('Searching restaurants with query:', queryString);
    const response = await fetch(`${API_BASE_URL}?${queryString}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Search results:', data);
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Network error");
  }
};

