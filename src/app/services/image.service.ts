// src/app/services/image.service.ts
import { Injectable } from '@angular/core';
import { getDownloadURL, listAll, ref } from '@angular/fire/storage';
import { Storage } from '@angular/fire/storage';
import { from, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',  // Proporciona el servicio a nivel global
})
export class ImageService {
  private storagePath = 'images'; // Ruta en Firebase Storage

  constructor(private storage: Storage) {}

  getImages() {
    const storageRef = ref(this.storage, this.storagePath);

    return from(listAll(storageRef)).pipe(
      switchMap(result => {
        const urlPromises = result.items.map(item => getDownloadURL(item));
        return from(Promise.all(urlPromises));
      }),
      map(urls => urls.map(url => ({ url, liked: false })))  // Mapea las URLs a objetos con 'liked' por defecto
    );
  }

  toggleLike(imageUrl: string) {
    // Aquí puedes gestionar si quieres hacer algo más cuando se marca "like" o "dislike"
  }
}
