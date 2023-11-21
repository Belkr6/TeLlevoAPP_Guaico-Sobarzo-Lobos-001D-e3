import { Component} from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-recoverpass',
  templateUrl: './recoverpass.page.html',
  styleUrls: ['./recoverpass.page.scss'],
})
export class RecoverpassPage  {
  email: string = '';
  loading: boolean = false;
  constructor(private loadingController: LoadingController, private afAuth: AngularFireAuth, public AuthService: FirestoreService, public route: Router) { }

  

  async rstPassword(email: string) {
    try {
      await this.AuthService.resetPassword(email);
      console.log('Email sent');
      this.route.navigate(['/register']);
    } catch (error) {
      console.log(error);
    }
  

  }

  async resetPassword() {
    try {
      this.loading = true;
      const loading = await this.loadingController.create({
        message: 'Enviando correo de recuperación...',
        duration: 5000 // Ajusta la duración según tus necesidades
      });
      await loading.present();

      await this.afAuth.sendPasswordResetEmail(this.email);
      console.log('Correo electrónico de recuperación enviado.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico de recuperación:', error);
    } finally {
      this.loading = false;
      await this.loadingController.dismiss();
      const successMessage = await this.loadingController.create({
        message: 'Correo enviado!',
        duration: 2000 // Puedes ajustar la duración según tus necesidades
      });
      await successMessage.present();
    }
  }

  
}