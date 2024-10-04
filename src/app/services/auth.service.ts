import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  user,
  signOut
} from '@angular/fire/auth';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { UserInterface } from '../models/user.interface';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firebaseAuth = inject(Auth);

  // Usamos BehaviorSubject para emitir el userId
  private userIdSubject = new BehaviorSubject<string | null>(null);
  private userId$ = this.userIdSubject.asObservable();

  constructor() {
    // Suscribimos el signal a los cambios en el usuario de Firebase
    user(this.firebaseAuth).subscribe((firebaseUser) => {
      if (firebaseUser) {
        // Emitimos el userId cuando el usuario está autenticado
        this.userIdSubject.next(firebaseUser.uid);
      } else {
        // Emitimos null si no hay usuario autenticado
        this.userIdSubject.next(null);
      }
    });
  }

  // Método para iniciar sesión con correo electrónico y contraseña
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(() => {})
      .catch(error => {
        console.error("Error during login: ", error);
        throw error; // Lanzar error para que sea manejado por el suscriptor
      });

    return from(promise);
  }

  // Método para cerrar sesión
  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth)
      .then(() => {})
      .catch(error => {
        console.error("Error during logout: ", error);
        throw error; // Lanzar error para que sea manejado por el suscriptor
      });

    return from(promise);
  }

  // Método para obtener el userId como un Observable reactivo
  getUserId(): Observable<string | null> {
    return this.userId$;
  }

  // Método para obtener el valor actual del userId sin necesidad de suscribirse
  getCurrentUserId(): string | null {
    return this.userIdSubject.getValue();
  }
}
