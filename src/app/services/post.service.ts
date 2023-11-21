import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/app/models/posts.model';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private firestore: AngularFirestore) { }


  createPost(post: Post) {
    return this.firestore.collection('posts').add(post);
  }

  getPosts() {
    return this.firestore.collection('posts').snapshotChanges();
  }


}


