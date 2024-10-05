import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Firestore, doc, getDoc, setDoc, updateDoc, increment, query, where, getDocs, collection, deleteDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

interface Image {
  id: string,
  url: string;
  likesCount: number;
  liked:boolean,
}

@Component({
  selector: 'listado-imagenes',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: 'listado-imagenes.component.html',
  styleUrls: ['listado-imagenes.component.css'],
})


export class ListadoImagenesComponent implements OnInit {
  
  @Input() mostrarUserId: boolean = false;
  userId: string | null = null;
  images: any[] = [];  // Initialize as an empty array
  @Input() categoria: string = 'feas'; 

  authService = inject(AuthService);

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.userId = this.authService.getUserId(); // Get user ID
    this.loadImages(); // Load images based on the user ID
  }

  async loadImages() {
    const imagesCollection = collection(this.firestore, `imagenes-${this.categoria}`);

    if (this.mostrarUserId === true && this.userId) {
      const q = query(imagesCollection, where('userId', '==', this.userId));
      const snapshot = await getDocs(q);

      for (const imageDoc of snapshot.docs) {
        const imageData = imageDoc.data();
        const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${this.userId}_${imageDoc.id}`);
        const likeDocSnap = await getDoc(likeDocRef);

        // Add image to the array
        this.images.push({
          id: imageDoc.id,
          url: imageData['url'],
          liked: likeDocSnap.exists(),
          likesCount: imageData['likesCount'] || 0,
        });
      }
    } else {
      // Fetch all images
      const snapshotTodas = await getDocs(imagesCollection);
      for (const imageDoc of snapshotTodas.docs) {
        const imageData = imageDoc.data();
        const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${this.userId}_${imageDoc.id}`);
        const likeDocSnap = await getDoc(likeDocRef);

        // Add image to the array
        this.images.push({
          id: imageDoc.id,
          url: imageData['url'],
          liked: likeDocSnap.exists(),
          likesCount: imageData['likesCount'] || 0,
        });
      }
    }
  }

    


  async toggleLike(image: any) {


    const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${this.userId}_${image.id}`);

    const imageDocRef = doc(this.firestore, `imagenes-${this.categoria}/${image.id}`);

    // Si la imagen no estaba likeada, tengo que buscar si ya hbaia likeado otra imagen
    if(!image.liked){

      // Verificar si el usuario ya ha dado "like" a alguna imagen
      const likesQuery = query(
        collection(this.firestore, `likes-${this.categoria}`),
        where('userId', '==', this.userId)
      );
      
      const likesSnapshot = await getDocs(likesQuery);
      console.log(likesSnapshot.empty);

      if (likesSnapshot.empty == false) {
        console.log(`El usuario ya ha dado 'like' a otra imagen ${this.categoria}.`);
        return; // Salir de la función si ya ha dado "like"
      }

      await setDoc(likeDocRef, { userId: this.userId, imageId: image.id });

      const imageDocSnap = await getDoc(imageDocRef);

      if (imageDocSnap.exists()) {
        // Incrementar el conteo de likes en la imagen
        await updateDoc(imageDocRef, {
          likesCount: increment(1)
        });

        // Actualiza el estado local de liked
        image.liked = true;
        image.likesCount++;

      } else {
        console.error("El documento de la imagen no existe:", image.id);
      }

    }

    // si la imagen estaba likeada, borro el like 
    else {

      await deleteDoc(likeDocRef); // Eliminar el documento de "like"

      await updateDoc(imageDocRef, {
        likesCount: increment(-1) // Restar 1 al contador de "likes"
      });

      image.liked = false;
      image.likesCount--;


    }
  
  }


}
