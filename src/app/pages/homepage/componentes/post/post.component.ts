import { Component, OnInit , Input} from '@angular/core';
import { PostService } from 'src/app/services/post.service';// Path to the PostService
import { MapsService } from 'src/app/services/maps.service'; // Path to the MapService
import { Post } from 'src/app/models/posts.model';
import { ProfileService } from 'src/app/services/profile.service';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  @Input() users: any[] = [];
  @Input() post: any;
  
  currentUser: any;
  constructor(private firestore: AngularFirestore,private authService: AngularFireAuth,private modalController: ModalController,private navCtrl: NavController,private profileService: ProfileService,private postService: PostService, private mapService: MapsService)
   { this.authService.currentUser.then(user => {
    this.currentUser = user;
  });}

  goBack() {
    this.navCtrl.back();
  }
  closeModal() {
    this.modalController.dismiss();
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


 

}
