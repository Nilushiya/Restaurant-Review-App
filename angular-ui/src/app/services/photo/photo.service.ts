import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private API_BASE_URL = 'http://localhost:8080/api/photos';

  constructor(
    private http:HttpClient
  ) { }

  getPhoto(relativePath: string): string {
    if (!relativePath) return 'assets/default-image.png';
    return `${this.API_BASE_URL}/${relativePath}`.replace(/([^:]\/)\/+/g, '$1');
  }

  uploadPhotos(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post(this.API_BASE_URL, formData);
  }

  deletePhoto(photoId: string): Observable<any> {
    return this.http.delete(`${this.API_BASE_URL}/${photoId}`);
  }

}
