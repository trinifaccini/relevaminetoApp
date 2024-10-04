


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
    username: "pperez12",
    email: "trini@trini.com",
    password: "123456"
  },
  {
    username: "martinapok",
    email: "martinap@hotmail.com",
    password: "marta96"
  },
  {
    username: "tomi_acu",
    email: "tomas_acu@gmail.com",
    password: "acunia12"
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

    this.authService
    .login(rawForm.email, rawForm.password)
    .subscribe(
      {
        next: () => {
          this.router.navigateByUrl('/inicio')
          this.loginForm.reset();

        },
        error: (err) => {
      
          const cleanedErrorCode = err.code.replace("auth/", "");
          this.errorMessage = authReponses[cleanedErrorCode]   

          console.log(this.errorMessage)
        }   
      })

  } 


  hide = signal(true);
  
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  autocompleCredentials(userIndex) {

    this.loginForm.setValue({
      email: users[userIndex].email,
      password: users[userIndex].password
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
