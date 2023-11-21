export interface Post {
  name: string;
  patente: string;
  origin: { lat: number, lng: number };
  destination: { lat: number, lng: number };
  route: any; // This will store the route data
}