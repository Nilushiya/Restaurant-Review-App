import { HttpClient } from '@angular/common/http';
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
  return this.http.post(`${this.API_BASE_URL}/restaurantByOwner`,value, { observe: 'response' });
  }

  getRestaurantsByOwner() {
  return this.http.get(`${this.API_BASE_URL}/restaurantByOwner`, { observe: 'response' });
  }

  deleteRestaurant(id: string){
    return this.http.delete(`${this.API_BASE_URL}/${id}`,{ observe: 'response' });
  }

  updateRestaurant(id: string, value: any){
        return this.http.put(`${this.API_BASE_URL}/${id}`, value, { observe: 'response' });
  }
}
