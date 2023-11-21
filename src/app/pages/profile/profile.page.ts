import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/models/profile.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Import AngularFireStorage
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: Profile;
  editing = false;
  bio: string;
  selectedImage: File;
  profileImageUrl: string;
  constructor(private router: Router, private db: AngularFireDatabase, private profileService: ProfileService, private afAuth: AngularFireAuth,private storage: AngularFireStorage) { }

  ngOnInit() {
    this.getProfileImageUrl();
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.profileService.getProfile(user.uid).subscribe(profile => {
          this.profile = profile; // Assign the retrieved profile to the class property
          this.bio = profile.bio;
          
        });
      }
    });
  }

  startEditing() {
    this.editing = true;
  }
  goToActionSheet() {
    this.router.navigate(['/homepage']);
  }

  saveBio() {
    this.profileService.updateProfile(this.profile.uid, { bio: this.bio });
    this.editing = false;
  }
  
  async subirImagen(event: any) {
    const file = event.target.files[0];
    const filePath = `profile_images/${file.name}`;
    const fileRef = this.storage.ref(filePath);

    await this.storage.upload(filePath, file);
    
    // Obtener la URL de descarga
    this.profileImageUrl = await fileRef.getDownloadURL().toPromise();
  }

  async getProfileImageUrl() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        const path = `profile_images/${userId}`;
        const fileRef = this.storage.ref(path);

        fileRef.getDownloadURL().subscribe(
          (url) => {
            this.profileImageUrl = url;
          },
          (error) => {
            console.error('Error al obtener la URL de descarga:', error);
            // Mantén la imagen predeterminada si hay un error
          }
        );
      }
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
    }
  }
  


  
  
}

