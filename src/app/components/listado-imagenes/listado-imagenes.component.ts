import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Firestore, doc, getDoc, setDoc, updateDoc, increment, query, where, getDocs, collection, deleteDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';


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



export class ListadoImagenesComponent implements OnInit, OnDestroy {
  
  @Input() categoria: string = '';
  images: Image[] = [];
  userId: any;
  @Input() user: boolean = false;
  private userIdSubscription: Subscription | undefined;

  constructor(private firestore: Firestore, private authService: AuthService) {}

  ngOnInit() {
    console.log("ngOnInit ejecutado en ListadoImagenesComponent");
  
    this.userIdSubscription = this.authService.getCurrentUserId().subscribe(userId => {
      if (userId) {
        console.log('User ID:', userId);
        this.userId = userId;
        this.loadImages();
      } else {
        console.log('No user authenticated or userId is null:', userId);
        setTimeout(() => {
          console.log('Still no user authenticated');
        }, 1000);
      }
    });
  }

  ngOnDestroy() {

    console.log("DESTRUYENDO LISTADO IMAGENES");
    
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }

  async loadImages() {
    
    const imagesCollection = collection(this.firestore, `imagenes-${this.categoria}`);

    // si tengo que mostrar las imagenes propias
    if(this.user === true) {
      const q = query(imagesCollection, where('userId', '==', this.userId));
      const snapshot = await getDocs(q);

      for (const imageDoc of snapshot.docs) {
        const imageData = imageDoc.data();
  
        // Verificar si el usuario ha dado "like" a esta imagen
        const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${this.userId}_${imageDoc.id}`);
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

    else {

      console.log("acaaaa")
      const snapshotTodas = await getDocs(imagesCollection);

      for (const imageDoc of snapshotTodas.docs) {

        const imageData = imageDoc.data();

        // Verificar si el usuario ha dado "like" a esta imagen
        const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${this.userId}_${imageDoc.id}`);
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
