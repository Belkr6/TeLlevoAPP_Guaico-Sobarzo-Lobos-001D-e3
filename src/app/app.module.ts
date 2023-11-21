import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from  '@angular/fire/compat/database';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FirestoreModule, getFirestore as getFirestore_alias, provideFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms'; // Import the FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CreatepostpageComponent } from 'src/app/pages/homepage/componentes/createpostpage/createpostpage.component'; // replace with the actual path to CreatepostpageComponent
import 'firebase/firestore';
import { PostComponent } from './pages/homepage/componentes/post/post.component';
import { GoogleMapsModule } from '@angular/google-maps';



const app = initializeApp(environment.firebaseConfig);
const firestore = getFirestore(app);
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { initializeApp as initializeApp_alias, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';


firebase.initializeApp(environment.firebaseConfig);
const db = firebase.firestore();
console.log(db);

@NgModule({
  declarations: [AppComponent,CreatepostpageComponent,PostComponent],
    imports: [BrowserModule, 
              IonicModule.forRoot(),
              AppRoutingModule,
              AngularFireModule.initializeApp(environment.firebaseConfig),
              AngularFireAuthModule,
              AngularFireDatabaseModule,
              FirestoreModule,
              FormsModule,
              GoogleMapsModule,
              ReactiveFormsModule,
              HttpClientModule,
              provideFirebaseApp(() => initializeApp({"projectId":"tellevoapp-3e10e","appId":"1:426812801133:web:eeb410efd7812e6f45ff64","storageBucket":"tellevoapp-3e10e.appspot.com","apiKey":"AIzaSyCiunTlFKaQ9MENdTG1wNnXc1JlKxpaQxg","authDomain":"tellevoapp-3e10e.firebaseapp.com","messagingSenderId":"426812801133","measurementId":"G-LQ9S49J0EJ"})),
              provideAuth(() => getAuth()),
              provideFirestore(() => getFirestore()) ],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
    bootstrap: [AppComponent],
  })
  export class AppModule {}

