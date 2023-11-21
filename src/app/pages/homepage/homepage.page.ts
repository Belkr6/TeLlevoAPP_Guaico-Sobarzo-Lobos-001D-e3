import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/models/profile.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/posts.model';
import { ModalController } from '@ionic/angular';
import { CreatepostpageComponent } from 'src/app/pages/homepage/componentes/createpostpage/createpostpage.component'; // replace with the actual path to CreatePostPage
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PostComponent } from './componentes/post/post.component';
import { NavController } from '@ionic/angular';
import { ViewChild } from '@angular/core';


declare var google: any;




  @Component({
    selector: 'app-homepage',
    templateUrl: './homepage.page.html',
    styleUrls: ['./homepage.page.scss'],
  })
  export class HomePage implements OnInit {
    @ViewChild(PostComponent) postComponent: PostComponent;
    profile: Profile;
    name: string;
    isModalOpen = false;
    role: string;
    currentUser: any;
    posts: any[];
    usersWhoTookTheTrip = [
      { name: 'Usuario 1' },
      { name: 'Usuario 2' },
      // ...
    ];
    private postsSubscription: Subscription;
    constructor(
      private authService: AngularFireAuth,
      private firestore: AngularFirestore,
      private modalController: ModalController,
      private postService: PostService,
      private router: Router,
      private profileService: ProfileService,
      private afAuth: AngularFireAuth,
      private navCtrl: NavController
    ) {
      this.authService.currentUser.then(user => {
        this.currentUser = user;
      });
    }

  
    

    ngOnInit() {
      this.afAuth.user.subscribe(user => {
        if (user) {
          this.postsSubscription = this.firestore.collection('posts').valueChanges().subscribe(posts => {
            // Assign posts to the posts variable
            this.posts = posts;
            console.log(posts);

            this.profileService.getProfile(user.uid).subscribe(profile => {
              this.profile = profile;
              this.role = profile.role;
              this.name = profile.name;

              // Any additional logic related to profile data

            });
          });
        }
      });
    }
    ngOnDestroy() {
      if (this.postsSubscription) {
        this.postsSubscription.unsubscribe();
      }
    }
    
    
    

    setOpen(isOpen: boolean) {
      this.isModalOpen = isOpen;
    }



    irARegistro() {
      this.router.navigate(['/register']);
    }


   

    signOut() {
      this.afAuth.signOut().then(() => {
        this.router.navigate(['/login']);
      });
    }

    async takeTrip(post) {
      // Comprueba si hay suficiente capacidad en el vehículo
      if (post.capacidad <= 0) {
        console.error('No hay suficiente capacidad en el vehículo para más personas');
        return;
      }
    
      // Disminuye la capacidad en 1
      post.capacidad -= 1;
    
      // Busca el documento con el driverId que coincide
      const snapshot = await this.firestore.collection('posts', ref => ref.where('driverId', '==', post.driverId)).get().toPromise();
      if (snapshot.empty) {
        console.error('No se encontró ningún documento con el driverId: ', post.driverId);
        return;
      }
    
      // Actualiza todos los documentos que coinciden
      snapshot.forEach(doc => {
        doc.ref.update({
          capacidad: post.capacidad
        }).then(() => {
          console.log('Capacidad actualizada con éxito');
          this.sendNotificationToDriver(post.driverId);
        }).catch((error) => {
          console.error('Error actualizando capacidad: ', error);
        });
      });
    
      // Aquí va tu lógica para crear una nueva instancia de chat...
    
      // Redirige al usuario a la página de chat
    
      // Abre el modal OpenUsersModal
      this.openUsersModal();
    }
    async promptNumberOfPeople(): Promise<number> {
      let numberOfPeople: number;
    
      // Aquí va tu lógica para mostrar un prompt o un modal y obtener el número de personas...
    
      return numberOfPeople;
    }
    async createChat(driverId: string, userId: string): Promise<string> {
      let chatId: string;
    
      // Aquí va tu lógica para crear una nueva instancia de chat...
    
      return chatId;
    }
    


    async endTrip(post) {
      // Primero, verifica si el usuario actual es el conductor del viaje
      if (this.currentUser.id !== post.driverId) {
        console.error('Solo el conductor puede finalizar el viaje');
        return;
      }


    
      // Aquí va tu lógica para finalizar el viaje...
    
      // Luego, borra el post
      await this.deletePost(post.id);
    
      console.log(`El viaje ${post.id} ha sido finalizado y el post ha sido borrado`);
    }
    
    async deletePost(postId: string) {
      // Borra el post de la base de datos
      this.firestore.collection('posts').doc(postId).delete().then(() => {
        console.log("Post successfully deleted!");
      }).catch((error) => {
        console.error("Error removing post: ", error);
      });
    }
    async sendNotificationToDriver(driverId: string) {
      console.log(`Enviando notificación al conductor ${driverId}...`);
    }

    async cancelTrip(post: any) {
      // Verifica si el usuario actual es el estudiante que tomó el viaje
      if (this.currentUser.id !== post.studentId) {
        console.error('Solo el estudiante que tomó el viaje puede cancelarlo');
        return;
      }
    
      // Incrementa la capacidad en 1
      post.capacidad += 1;
    
      // Busca el documento con el driverId que coincide
      const snapshot = await this.firestore.collection('posts', ref => ref.where('driverId', '==', post.driverId)).get().toPromise();
      if (snapshot.empty) {
        console.error('No se encontró ningún documento con el driverId: ', post.driverId);
        return;
      }
    
      // Actualiza todos los documentos que coinciden
      snapshot.forEach(doc => {
        doc.ref.update({
          capacidad: post.capacidad
        }).then(() => {
          console.log('Capacidad actualizada con éxito');
        }).catch((error) => {
          console.error('Error actualizando capacidad: ', error);
        });
      });
    
      // Aquí va tu lógica para cancelar el viaje...
    
      console.log(`El viaje ${post.id} ha sido cancelado y la capacidad ha sido incrementada`);
    }

 
    async openCreatePostModal() {
      const modal = await this.modalController.create({
        component: CreatepostpageComponent
      });
  
      return await modal.present();
    }

    async openUsersModal() {
      const modal = await this.modalController.create({
        component: PostComponent,
        componentProps: {
          users: this.usersWhoTookTheTrip,
        },
      });
  
      return await modal.present();
    }
    studentsTookTrip(): boolean {
      // Aquí debes implementar la lógica para verificar si los estudiantes tomaron un viaje.
      // Por ejemplo, podrías verificar si la lista de viajes tomados por los estudiantes no está vacía:
      return this.usersWhoTookTheTrip.length > 0;
    }
    
    driverHasPost(): boolean {
      // Aquí debes implementar la lógica para verificar si el conductor tiene un post.
      // Por ejemplo, podrías verificar si el conductor tiene al menos un post en la lista de posts:
      return this.posts.some(post => post.driverId === this.currentUser.uid);
    }

    goBack() {
      this.navCtrl.back();
    }

    
  }