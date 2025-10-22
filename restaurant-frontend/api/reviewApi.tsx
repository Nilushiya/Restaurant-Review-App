import { Alert } from 'react-native';
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = 'http://172.20.106.209:8080/api/reviews';

export const createReview = async (restaurantId:String, data: any, accessToken:String) => {
    console.log('Creating review for restaurant ID:', restaurantId, 'with data:', data, 'and accessToken:', accessToken);
  try {
    const response = await fetch(`${API_BASE_URL}/${restaurantId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
      }, body: JSON.stringify(data),});
    console.log('API response status:', response.status, response);
    if (response.status === 401) {
       Alert.alert("Error", "Jwt expired");
      throw new Error("Jwt expired");  
    }
    if(response.status === 200){
      const responseData = await response.json();
      return responseData;
    }
  } catch (error: any) {
    throw new Error(error.message || "Network error");
  }
}

export const getReviewsByRestaurantId = async (id:String, page:Number, accessToken:String) => {
  console.log('Fetching restaurants with accessToken:', id , page);
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/list?page=${page}&size=3`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
      },
    });
    console.log('API response status:', response.status, response);
    
    if(response.status === 401){
        console.log("Jwt expired");
        Alert.alert("Session Expired", "Your JWT token has expired. Please log in again.");
      return; 
    }
    if(response.status === 200) {
    const data = await response.json(); 
    console.log('Fetched reviews:', data);
    return data;}
 
}catch (error: any) {
    throw new Error(error.message || "Network error");
  }
};

export const getRestaurantsWithUserReviews = async (accessToken : String) => {
  console.log('Fetching restaurants with user reviews using accessToken:');
const decoded = jwtDecode<{ sub: string }>(accessToken);
   const userId = decoded.sub;

console.log("User ID:", userId);
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
      }});
    console.log("Fetched restaurants:", response);

    const data = await response.json();
    console.log("Fetched restaurants data:", data);

    // Filter reviews by current user
    const filteredData = data
      .map((restaurant) => ({
        ...restaurant,
        userReviews: restaurant.reviews.filter(
          (review) => review.writtenBy && review.writtenBy.id === userId
        ),
      }))
      .filter((r) => r.userReviews.length > 0); // keep only restaurants with user's reviews
console.log("Filtered restaurants with user reviews:", filteredData);
    return filteredData;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};