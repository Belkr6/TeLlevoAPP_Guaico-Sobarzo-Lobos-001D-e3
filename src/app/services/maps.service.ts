import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private http: HttpClient) { }
  getRoute(origin: { lat: number, lng: number }, destination: { lat: number, lng: number }) {
    // Replace 'YOUR_API_KEY' with your actual Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=AIzaSyCXioDgcv7ao80B4aCBNHAFIiVKWWebHWA`;
    return this.http.get(url);
  }


}
