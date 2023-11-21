import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Profile } from '../models/profile.model';
import {tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})


  

  export class ProfileService {
    private profileDoc!: AngularFirestoreDocument<Profile>;

    constructor(private afs: AngularFirestore, private db: AngularFirestore, private storage: AngularFireStorage) { }

    createProfile(uid: string, profile: Profile): Promise<void> {
      this.profileDoc = this.afs.doc<Profile>(`profiles/${uid}`);
      return this.profileDoc.set(profile);
    }

    getProfile(uid: string): Observable<Profile> {
      this.profileDoc = this.afs.doc<Profile>(`profiles/${uid}`);
      return this.profileDoc.valueChanges().pipe(
        // Filter out undefined values
        filter((profile): profile is Profile => !!profile),
        tap(profile => console.log(profile)) // Log the retrieved profile to the console
      );
    }

    async updateProfile(uid: string, profileData: any): Promise<void> {
      const profileRef = this.db.collection('profiles').doc(uid);
      await profileRef.set(profileData, { merge: true });
    }

    uploadProfileImage(image: File, userId: string): Promise<string> {
      const path = `profile_images/${userId}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(path);
  
      return fileRef.put(image).then(() => {
        return fileRef.getDownloadURL().toPromise();
      });
    }

  }

  



  