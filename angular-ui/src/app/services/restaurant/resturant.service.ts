import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResturantService {
  private API_BASE_URL = 'http://localhost:8080/api/restaurants';

  constructor(
    private http:HttpClient
  ) { }

  createRestaurantsByOwner(value: any) {
  return this.http.post(`${this.API_BASE_URL}`,value, { observe: 'response' });
  }

  searchRestaurants(params: {
    q?: string;
    minRating?: number;
    latitude?: number;
    longitude?: number;
    radius?: number;
    page?: number;
    size?: number;
  } = {}) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key: string) => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        queryParams = queryParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(this.API_BASE_URL, { params: queryParams });
  }

  getRestaurantsByOwner() {
  return this.http.get(`${this.API_BASE_URL}/restaurantByOwner`, { observe: 'response' });
  }

  getRestaurantsById(id:string) {
  return this.http.get(`${this.API_BASE_URL}/${id}`, { observe: 'response' });
  }

  deleteRestaurant(id: string){
    return this.http.delete(`${this.API_BASE_URL}/${id}`,{ observe: 'response' });
  }

  updateRestaurant(id: string, value: any){
        return this.http.put(`${this.API_BASE_URL}/${id}`, value, { observe: 'response' });
  }
}
