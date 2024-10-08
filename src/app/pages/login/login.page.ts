


import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

const authReponses = {
  //"invalid-email": "No existe un usuario registrado con esa dirección",
  //"missing-password": "No existe un usuario registrado con esa dirección",
  "invalid-credential": "No existe ese correo o esa combinacion de correo y contraseña",
  "too-many-requests": "Muchas solicitudes, intente en unos minutos",
}

const users = [
  {
    id: 1,
    username: "pperez12",
    email: "admin@admin.com",
    password: "111111",
    perfil: "ADMINITRADOR"
  },
  {
    id: 2,
    username: "martinapok",
    email: "invitado@invitado.com",
    password: "222222",
    perfil: "INVITADO"

  },
  {
    id: 3,
    username: "tomi_acu",
    email: "usuario@usuario.com",
    password: "333333",
    perfil: "USUARIO"

  },
  {
    id: 4,
    username: "tomi_acu",
    email: "anonimo@anonimo.com",
    password: "444444",
    perfil: "ANONIMO"

  },
  {
    id: 5,
    username: "tomi_acu",
    email: "tester@tester.com",
    password: "555555",
    perfil: "TESTER"

  }
]


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule, MatButton]
})


export class LoginPage implements OnInit, OnDestroy {
  
  users = users;
  authService = inject(AuthService)
  fb = inject(FormBuilder)
  router = inject(Router)

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder) {}


  onSubmit() : void {

    const rawForm = this.loginForm.getRawValue()
    this.authService.login(rawForm.email, rawForm.password);
    this.router.navigate(['/inicio']);
  }


  hide = signal(true);
  
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  autocompleCredentials(userIndex) {

    this.loginForm.setValue({
      email: users[userIndex-1].email,
      password: users[userIndex-1].password
    });
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

}
