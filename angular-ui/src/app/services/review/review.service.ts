import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private API_BASE_URL = 'http://localhost:8080/api/reviews';
  constructor(
    private http:HttpClient,
  ) { }

  createReviews(value: any,id: string) {
    return this.http.post(`${this.API_BASE_URL}/${id}`,value, { observe: 'response' });
  }

    listReviews(params: {
      page?: number;
      size?: number;
    } = {},restaurantId:string) {
      let queryParams = new HttpParams();
      Object.keys(params).forEach((key: string) => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          queryParams = queryParams.set(key, value.toString());
        }
      });
  
      return this.http.get<any>(`${this.API_BASE_URL}/${restaurantId}/list`, { params: queryParams });
    }

    getReview(restaurantId:string,reviewId:string){
      return this.http.get(`${this.API_BASE_URL}/${restaurantId}/${reviewId}`,{ observe: 'response' })
    }

    updateReview(restaurantId:string,reviewId:string){
      return this.http.put(`${this.API_BASE_URL}/${restaurantId}/${reviewId}`,{ observe: 'response' })
    }

    deleteReview(restaurantId:string,reviewId:string){
      return this.http.delete(`${this.API_BASE_URL}/${restaurantId}/${reviewId}`)
    }

}


