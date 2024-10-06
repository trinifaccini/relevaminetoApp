import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ImagenService {
  private imagenesSubject = new BehaviorSubject<boolean>(false);

  imagenes$ = this.imagenesSubject.asObservable();

  emitirCambio() {
    this.imagenesSubject.next(true);  // Notificar que se ha subido una imagen
  }
}
