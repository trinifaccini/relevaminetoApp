import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  user,
  signOut
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from '../models/user.interface';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  constructor() {
    // Suscribimos el signal a los cambios en el usuario
    this.user$.subscribe(user => {
      this.currentUserSig.set(user ? { uid: user.uid, email: user.email } : null);
    });    
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(() => {})
      .catch(error => {
        console.error("Error during login: ", error);
        throw error; // Lanzar error para que sea manejado por el suscriptor
      });

    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth)
      .then(() => {})
      .catch(error => {
        console.error("Error during logout: ", error);
        throw error; // Lanzar error para que sea manejado por el suscriptor
      });

    return from(promise);
  }

  getCurrentUserId(): Observable<string | null> {
    return this.user$.pipe(
      map(user => user?.uid || null),
      filter(uid => uid !== null) // Filtrar valores nulos
    );
  }
  
  
  

}
