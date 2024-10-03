import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Firestore, doc, getDoc, setDoc, updateDoc, increment, query, where, getDocs, collection, deleteDoc } from '@angular/fire/firestore';

// src/app/components/image-list/image-list.component.ts
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
  
  @Input() categoria: string = '';
  images: Image[] = [];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.loadImages();
    console.log(this.categoria)
  }

  async loadImages() {

    const userId = 'fHdLiJuG2nR3OK3nNJwxs8ecfoj1'; // ID del usuario logueado


    const imagesCollection = collection(this.firestore, `imagenes-${this.categoria}`);
    const snapshot = await getDocs(imagesCollection);

    for (const imageDoc of snapshot.docs) {
      const imageData = imageDoc.data();

      // Verificar si el usuario ha dado "like" a esta imagen
      const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${userId}_${imageDoc.id}`);
      const likeDocSnap = await getDoc(likeDocRef);

      // Agregar la imagen a la lista, marcándola como "likeada" o no
      this.images.push({
        id: imageDoc.id,
        url: imageData['url'], // Asumiendo que el campo es 'url'
        liked: likeDocSnap.exists(), // Verificar si existe un "like" en Firestore
        likesCount: imageData['likesCount'] || 0 // Contador de likes
      });
    }
  }


async toggleLike(image: Image) {
  const userId = 'fHdLiJuG2nR3OK3nNJwxs8ecfoj1'; // FACCINI TRINIDAD

  const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${userId}_${image.id}`);

  const imageDocRef = doc(this.firestore, `imagenes-${this.categoria}/${image.id}`);

  // Si la imagen no estaba likeada, tengo que buscar si ya hbaia likeado otra imagen
  if(!image.liked){

     // Verificar si el usuario ya ha dado "like" a alguna imagen
    const likesQuery = query(
      collection(this.firestore, `likes-${this.categoria}`),
      where('userId', '==', userId)
    );
    
    const likesSnapshot = await getDocs(likesQuery);

    if (!likesSnapshot.empty) {
      console.log(`El usuario ya ha dado 'like' a otra imagen ${this.categoria}.`);
      return; // Salir de la función si ya ha dado "like"
    }

    await setDoc(likeDocRef, { userId, imageId: image.id });

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
