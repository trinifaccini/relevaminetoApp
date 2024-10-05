import { Injectable } from '@angular/core';
import { UserInterface } from '../models/user.interface';
import { Image } from '../models/image.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, map } from 'rxjs';



@Injectable({
  providedIn: 'root',
})

export class DatabaseService {

  constructor(private firestore: AngularFirestore) {}

  agregarUsuario(user: UserInterface) {
    const usersCollection = this.firestore.collection('usuarios');
    const documento = usersCollection.doc();
    user.id = documento.ref.id;

    documento.set({ ...user });
    // colUsuarios.add({ ...user });
  }

  agregarImagen(category: string, downloadURL: string, imageName: string, userId: string){

    try {
        const imagesCollection = this.firestore.collection('imagenes-feas'); // Referencia a la colección de Firestore
        
        const img : Image = {
            url: downloadURL,  // URL de la imagen subida
            imageName: imageName,   // Nombre del archivo que incluye el nombre de usuario
            userId: userId,    // ID del usuario que subió la imagen
            timestamp: new Date(),  // Fecha de subida
            likesCount: 0, 
        }

        imagesCollection.add({...img})
        console.log('Imagen guardada en Firestore con éxito');
      } catch (error) {
        console.error('Error al guardar la imagen en Firestore:', error);
      }

    

  }


  traerImagenes(userId: string, mostrar: boolean, categoria: string) {

    const imagesCollection = this.firestore.collection(`imagenes-${categoria}`);

    let images : any;

    if (mostrar && userId) {
      // Si se muestran solo las imágenes del usuario
      const queryPromise = imagesCollection.ref
        .where('userId', '==', userId)
        .get();

      // Convertir la promesa en observable usando `from()`
      images = from(queryPromise).pipe(
        map(snapshot => this.processSnapshot(snapshot, categoria, userId))
      );
    } else {
      // Si se muestran todas las imágenes
      images = imagesCollection.valueChanges();
    }

    return images;
  }

  processSnapshot(snapshot: any, categoria: string, userId: string): any[] {
    const images: any[] = [];
    snapshot.forEach(async (imageDoc: any) => {
      const imageData = imageDoc.data();

      // Verificar si el usuario ha dado "like" a esta imagen
      const likeDocRef = this.firestore.collection(`likes-${categoria}`).doc(`${userId}_${imageDoc.id}`);
      const likeDocSnap = await likeDocRef.get().toPromise();

      // Agregar la imagen a la lista, marcándola como "likeada" o no
      images.push({
        id: imageDoc.id,
        url: imageData['url'],
        liked: likeDocSnap.exists,
        likesCount: imageData['likesCount'] || 0,
      });
    });

    return images;
  }

  traerUsuarios() {
    const colUsuarios = this.firestore.collection('usuarios');

    /*
    const observable = colUsuarios.get();

    observable.subscribe((resultado) => {
      resultado.docs.forEach((documento) => {
        console.log(documento.data());
      });
    });
    */

    const observable = colUsuarios.valueChanges();
    return observable;
  }

  modificar(usuario: UserInterface) {
    const colUsuarios = this.firestore.collection('usuarios');
    const documento = colUsuarios.doc(usuario.id);
    documento.update({ ...usuario });
  }


  eliminar(usuario: UserInterface) {
    const colUsuarios = this.firestore.collection('usuarios');
    const documento = colUsuarios.doc(usuario.id);
    documento.delete();
  }
}