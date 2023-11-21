import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GoogleDirectionsServiceService {

  private apiKey = 'AIzaSyCXioDgcv7ao80B4aCBNHAFIiVKWWebHWA'; // Reemplaza con tu API Key de Google Places
  private apiUrl = '/maps/api/place';

  constructor(private http: HttpClient) {}

  searchPlaces(query: string): Observable<any> {
    const url = `${this.apiUrl}/textsearch/json?query=${query}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getPlaceDetails(placeId: string): Observable<any> {
    const url = `${this.apiUrl}/details/json?place_id=${placeId}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getDirections(origen: any, destino: any): Observable<any> {
    const url = `${this.apiUrl}/directions/json?origin=${origen.lat},${origen.lng}&destination=${destino.lat},${destino.lng}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
