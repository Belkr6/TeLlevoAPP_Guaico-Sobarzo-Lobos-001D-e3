import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  @Output() cerrarSeccion = new EventEmitter<void>();
  loginForm: FormGroup;
  
  constructor(public fb: FormBuilder, public LoadingCtrl: LoadingController, public AuthService: FirestoreService, private router: Router, public alertController: AlertController) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  

  async loginF() {
    const loading = await this.LoadingCtrl.create();
    await loading.present();
    if (this.loginForm.valid) {
      try {
        const user = await this.AuthService.loginUser(this.loginForm.value.email, this.loginForm.value.password);
        if (user) {
          loading.dismiss();
          this.router.navigate(['/homepage']);
        }
        
      } catch (error) {
        
        
      }
    }else {
          
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo o Email invalidos, intentalo denuevo.',
        buttons: ['OK']
      });
      await alert.present();
      loading.dismiss();
    } 
      
    
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
  
    }

  

  
  }
  cerrar() {
    this.cerrarSeccion.emit();
  }
  
  
  

}