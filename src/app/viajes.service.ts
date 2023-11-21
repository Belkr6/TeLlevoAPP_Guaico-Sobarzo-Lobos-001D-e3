import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ViajesService {
  private viajes: any[] = [];
  private vehiculosDisponibles: boolean = false;

  constructor() {}

  hayVehiculosDisponibles(): boolean {
    return this.vehiculosDisponibles;
  }

  // Método para obtener la lista de viajes programados
  getViajes(): any[] {
    return this.viajes;
  }

  // Método para agregar un nuevo viaje programado
  agregarViaje(viaje: any): void {
    this.viajes.push(viaje);
  }

  solicitarViaje(): void {
    // Agrega la lógica para solicitar un viaje aquí
    // Puedes mostrar un mensaje en consola o actualizar propiedades para indicar que se solicitó un viaje
  }
}
