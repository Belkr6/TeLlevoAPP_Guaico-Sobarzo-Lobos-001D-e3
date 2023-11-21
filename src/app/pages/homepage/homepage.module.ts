import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './homepage-routing.module';
import { HomePage } from './homepage.page';
import { ProgramarViajeComponent } from '../../programar-viaje/programar-viaje.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, ProgramarViajeComponent ],
  exports: [ProgramarViajeComponent]
})
export class HomePageModule {}
