import { Injectable, OnInit, inject } from '@angular/core';
import {
  Auth,
  Unsubscribe,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements OnInit {

  usuario: any = null;
  authSubscription?: Unsubscribe;
  private auth = inject(Auth);

  //  private router = inject(Router);

  constructor() {
    console.log('entra');
    this.authSubscription = this.auth.onAuthStateChanged((auth) => {
      console.log(auth);
      if (auth?.email) {
        this.usuario = auth;
        // this.router.navigateByUrl('');
      } else {
        this.usuario = null;
      }
    });
  }

  ngOnInit() {}

 
  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    this.auth.signOut();
  }

  // Método para obtener el UID del usuario autenticado
  getUserId(): string | null {
    return this.usuario ? this.usuario.uid : null; // Retorna el UID si el usuario está autenticado
  }
  
}