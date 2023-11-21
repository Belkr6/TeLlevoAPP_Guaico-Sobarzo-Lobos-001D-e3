import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage'; 
import { Post } from '../models/posts.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Profile } from '../models/profile.model';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  user$: Observable<firebase.User | null>;
  constructor(public firestore:AngularFirestore,public ngFireAuth: AngularFireAuth, private rtr: Router, public alertController: AlertController, private storage: AngularFireStorage) { this.user$ = this.ngFireAuth.authState;}

  async registerUser(
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    username: string,
    bio: string,
    profileImage: File
  ) {
    if (!email || !password || !confirmPassword || !name || !username) {
      throw new Error('All fields are required');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
  
    try {
      const result = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  
      if (result.user) {
        const userRef = firebase.firestore().collection('profiles').doc(result.user.uid);
  
        // Upload the profile image and get the download URL
        const imageUrl = await this.uploadProfileImage(profileImage, result.user.uid);
  
        // Save user data including bio and profile image URL
        await userRef.set({
          uid: result.user.uid,
          name,
          username,
          email,
          password,
          bio: bio || "",
          profileImage: imageUrl,
          role: null,
        });
  
        // Display a popup with two options for the user to select a role
        const alert = await this.alertController.create({
          header: 'Selecciona qué tipo de usuario eres',
          inputs: [
            {
              name: 'Conductor',
              type: 'radio',
              label: 'Conductor',
              value: 'Conductor',
              checked: true,
            },
            {
              name: 'Estudiante',
              type: 'radio',
              label: 'Estudiante',
              value: 'Estudiante',
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Ok',
              handler: (data) => {
                // Update the user's profile in Firestore with the selected role
                userRef.update({ role: data });
  
              },
            },
          ],
        });
  
        await alert.present();
        return result.user;
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Noooo se equivoco, no tú. El codigo');
    }
  }
  
  async uploadProfileImage(image: File, userId: string): Promise<string> {
    const path = `profile_images/${userId}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(path);
  
    return fileRef.put(image).then(() => {
      return fileRef.getDownloadURL().toPromise();
    });
  }
  
  
  async loginUser(email: string, password: string) {
    try {
      const result = await this.ngFireAuth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async resetPassword(email: string) {
    try {
      const result = await this.ngFireAuth.sendPasswordResetEmail(email);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async signOut() {
    try {
      await this.ngFireAuth.signOut();
      this.rtr.navigate(['/register']); // Redirect to login page after sign out
    } catch (error) {
      console.log(error);
    }
  }

  async getProfile() { // Método para obtener el perfil del usuario
    try {
      const user = await this.ngFireAuth.currentUser;
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  addPost(post: Post): Promise<any> {
    return this.firestore.collection('publicaciones').add(post);
  }

  getPosts(): Observable<Post[]> {
    return this.firestore.collection<Post>('publicaciones').valueChanges();
  }

  private recargaRealizada = false;

  // Devuelve el estado actual de la recarga
  getRecargaRealizada(): boolean {
    return this.recargaRealizada;
  }

  // Marca que la recarga ha sido realizada
  marcarRecargaRealizada() {
    this.recargaRealizada = true;
  }
  
  async getUserData(): Promise<Observable<Profile>> {
    return this.firestore.doc<Profile>(`profiles/${(await this.ngFireAuth.currentUser).uid}`).valueChanges();
  }


  

  
}
  
 

  
