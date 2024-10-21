import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Firestore, doc, getDoc, setDoc, updateDoc, increment, query, where, getDocs, collection, deleteDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

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
  
  @Input() userId: string | null = null;
  @Input() categoria: string = 'feas'; 
  @Input() images: any[] = []; 

  authService = inject(AuthService);

  constructor(private firestore: Firestore, private cdr: ChangeDetectorRef) {}

  ngOnInit() {

    console.log("En listado imagenes compnent");
    
    console.log((this.images));
    
    
  }


  async toggleLike(image: any) {

    const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${this.userId}_${image.id}`);

    const imageDocRef = doc(this.firestore, `imagenes-${this.categoria}/${image.id}`);

    // Si la imagen no estaba likeada, tengo que buscar si ya hbaia likeado otra imagen
    if(!image.liked){

      // // Verificar si el usuario ya ha dado "like" a alguna imagen
      // const likesQuery = query(
      //   collection(this.firestore, `likes-${this.categoria}`),
      //   where('userId', '==', this.userId)
      // );
      
      // const likesSnapshot = await getDocs(likesQuery);
      // console.log(likesSnapshot.empty);

      // if (likesSnapshot.empty == false) {
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Error',
      //     text: `El usuario ya ha dado 'me gusta' a otra imagen ${this.categoria}.`,
      //     heightAuto: false
      //   });

      //   return
      // }

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
