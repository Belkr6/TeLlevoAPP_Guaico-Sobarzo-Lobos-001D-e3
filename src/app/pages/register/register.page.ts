import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
})

export class RegisterPage implements OnInit, AfterViewInit {
  showLoader = true;
  mostrarRegistro = false; // Variable to control if the registration section is displayed
  mostrarInicioSesion = false; // Variable to control if the login section is displayed
  usuario: FormGroup;
  selectedTipo: string = '';
  mostrarFormulario = true;
  exitoRecuperacion = false;
  email: string = '';

  constructor(private afAuth: AngularFireAuth, public fb: FormBuilder, private router: Router, public LoadingCtrl: LoadingController, public AuthService: FirestoreService, public alertController: AlertController) {
    this.usuario = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      confirmPassword: ['', [Validators.required]],
      name: ['', Validators.required],
      username: ['', Validators.required],
      
    }, { validator: [this.passwordMatchValidator] });
  }

  

  async register() {
    const loading = await this.LoadingCtrl.create();
    await loading.present();

    if (this.usuario.valid) {
      try {
        await this.AuthService.registerUser(
        
          this.usuario.value.email,
          this.usuario.value.password,
          this.usuario.value.confirmPassword,
          this.usuario.value.name,
          this.usuario.value.username,
          this.usuario.value.role,
          this.usuario.value.bio,
          
        );
        loading.dismiss();
        this.router.navigate(['/profile']);
      } catch (error: any) {
        console.log('error', error);
        loading.dismiss();
        if (error.code === 'auth/email-already-in-use') {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'The email address is already in use',
            buttons: ['OK']
          });
          await alert.present();
          console.log('The email address is already in use');
        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'An error occurred while registering the user',
            buttons: ['OK']
          });
          await alert.present();
          console.log('An error occurred while registering the user');
          // Show a generic error message to the user
        }
      }
    } else {
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'The form is invalid or the passwords do not match',
        buttons: ['OK']
      });
      await alert.present();
      console.log('The form is invalid or the passwords do not match');
    }
  }

  matchValues(matchTo: string): any {
    return (control: any): { [key: string]: any } | null => {
      const formGroup = control.parent;
      if (formGroup && formGroup.controls[matchTo]) {
        const matchToValue = formGroup.controls[matchTo].value;
        return control.value === matchToValue ? null : { mismatch: true };
      }
      return null;
    };
  }

  onConductorChange(event: any) {
    if (event.detail.checked) {
      this.usuario.get('Conductor')?.setValue(true);
      this.usuario.get('Estudiante')?.setValue(false);
      this.selectedTipo = 'Conductor';
    }
  }

  onEstudianteChange(event: any) {
    if (event.detail.checked) {
      this.usuario.get('Conductor')?.setValue(false);
      this.usuario.get('Estudiante')?.setValue(true);
      this.selectedTipo = 'Estudiante';
    }
  }


  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
  
    if (password === confirmPassword) {
      return null; // Las contraseñas coinciden, no hay error
    } else {
      return { mismatch: true }; // Las contraseñas no coinciden
    }
  }

  roleValidator(control: AbstractControl) {
    const Conductor = control.get('Conductor')?.value;
    const Estudiante = control.get('Estudiante')?.value;
    if ((Conductor && Estudiante) || (!Conductor && !Estudiante)) {
      return { invalidRole: true };
    }
    return null;
  }

  mostrarSeccion(seccion: string) {
    if (seccion === 'registro') {
      this.mostrarRegistro = true;
      this.mostrarInicioSesion = false;
    } else if (seccion === 'inicioSesion') {
      this.mostrarRegistro = false;
      this.mostrarInicioSesion = true;
    }
  }

  cerrarSeccion() {
    this.mostrarRegistro = false;
    this.mostrarInicioSesion = false;
  }

  guardarDatos() {
    console.log(this.usuario.value);
  }

  ngOnInit() {
    console.log('ngOnInit executed');
    this.showLoader = true;
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit executed');
    this.showLoader = false;
  }

  async resetPassword(email: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Correo electrónico de recuperación enviado.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico de recuperación:', error);
    }
  }

  async enviarCorreoRecuperacion() {
    try {
      await this.afAuth.sendPasswordResetEmail(this.email);
      this.mostrarFormulario = false;
      this.exitoRecuperacion = true;
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      // Manejar el error y proporcionar retroalimentación al usuario si es necesario
    }
  }




}



