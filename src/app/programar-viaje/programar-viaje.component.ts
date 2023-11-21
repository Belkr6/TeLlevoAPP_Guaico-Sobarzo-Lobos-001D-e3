import { Component } from '@angular/core';
import { ViajesService } from '../viajes.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.component.html',
  
})
export class ProgramarViajeComponent {
  destino: string = '';
  horaSalida: string = '';
  costoPorPersona: number = 0;

  constructor(private viajesService: ViajesService, private alertController: AlertController) {}
  async mostrarAlerta() {
    const alert = await this.alertController.create({
      header: 'Datos del Viaje',
      message: `
        <strong>Destino:</strong> {{ destino }}<br>
        <strong>Hora de Salida:</strong> {{ horaSalida }}<br>
        <strong>Costo por Persona:</strong> {{ costoPorPersona }}<br>
      `,
      buttons: ['Cerrar'],
      mode: 'ios' // O 'md' según prefieras
    });
  
    await alert.present();
  }
  
  programarViaje(): void {
    // Crea un objeto con los detalles del viaje
    const nuevoViaje = {
      destino: this.destino,
      horaSalida: this.horaSalida,
      costoPorPersona: this.costoPorPersona,
    };

    // Agrega el viaje al servicio de viajes
    this.viajesService.agregarViaje(nuevoViaje);

    // Reinicia los campos del formulario
    this.destino = '';
    this.horaSalida = '';
    this.costoPorPersona = 0;
  }

  



  
}
