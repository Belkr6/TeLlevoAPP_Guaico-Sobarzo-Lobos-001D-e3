import { Component,ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

declare var google: any;
@Component({
  selector: 'app-createpostpage',
  templateUrl: './createpostpage.component.html',
  styleUrls: ['./createpostpage.component.scss'],
})
export class CreatepostpageComponent {
  destination: string;
  mapUrl: SafeResourceUrl;
  postForm: FormGroup;
  posts: any[] = [];
  currentUser: any;
  constructor(private authService: AngularFireAuth,private formBuilder: FormBuilder, private firestore: AngularFirestore,  private modalController: ModalController, private sanitizer: DomSanitizer) {
    this.authService.currentUser.then(user => {
      this.currentUser = user;
    });
    this.postForm = this.formBuilder.group({
      destination: [''],
      patente: [''],
      capacidad: [''],
      price: [''],
      
    });
    
    
   }
    
   

  cancel() {
    this.modalController.dismiss();
  }

  getGoogleMapsUrl(destination: string): SafeResourceUrl {
    const baseUrl = 'https://www.google.com/maps/embed/v1/directions';
    const origin = 'Duoc UC: Sede Maipu';
    const apiKey = 'AIzaSyCXioDgcv7ao80B4aCBNHAFIiVKWWebHWA';
    const center = '-33.51115192766463,-70.75249220424112';
    const zoom = '13';
    const url = `${baseUrl}?origin=${origin}&destination=${destination}&key=${apiKey}&center=${center}&zoom=${zoom}`;
  
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getGoogleMapsImageUrl(destination: string): string {
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    const apiKey = 'AIzaSyCXioDgcv7ao80B4aCBNHAFIiVKWWebHWA';
    const origin = 'Duoc UC: Sede Maipu';
    const markers = `markers=color:red%7Clabel:O%7C${origin}&markers=color:red%7Clabel:D%7C${destination}`;
    const path = `path=color:0x0000ff|weight:5|${origin}|${destination}`;
    const size = 'size=600x300';
    const url = `${baseUrl}?${size}&${markers}&${path}&key=${apiKey}`;
  
    return url;
  }

  createPost() {
  const destination = this.postForm.get('destination').value;
  const patente = this.postForm.get('patente').value;
  const capacidad = this.postForm.get('capacidad').value;
  const mapUrl = this.getGoogleMapsUrl(destination);
  const mapImageUrl = this.getGoogleMapsImageUrl(destination);
  const price = this.postForm.get('price').value;
  

  const post = {
    destination: destination,
    patente: patente,
    capacidad: capacidad,
    currentCapacity: 0,
    driverId: this.currentUser.uid,
    price: price,
    mapUrl: (mapUrl as any).changingThisBreaksApplicationSecurity, // Convert SafeResourceUrl to string
    mapImageUrl: mapImageUrl, // Add the image URL to the post
    // Add other fields as necessary
  };

  this.firestore.collection('posts').add(post)
    .then(() => {
      console.log('Post added successfully');
      this.modalController.dismiss();
    })
    .catch(error => console.error('Error adding post: ', error));
}

  
  

  

 
  

  
}

