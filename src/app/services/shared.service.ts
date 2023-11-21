// google-places.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {
  private apiKey = 'AIzaSyCXioDgcv7ao80B4aCBNHAFIiVKWWebHWA'; // Reemplaza con tu API Key de Google Places
  private apiUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor(private http: HttpClient) {}

  searchPlaces(query: string): Observable<any> {
    const url = `${this.apiUrl}/textsearch/json?query=${query}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getPlaceDetails(placeId: string): Observable<any> {
    const url = `${this.apiUrl}/details/json?place_id=${placeId}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
