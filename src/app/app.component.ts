import { Component, OnDestroy, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { IonicModule, Platform } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SplashScreen } from '@capacitor/splash-screen'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    IonicModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit, OnDestroy {

  authService = inject(AuthService);
  title: any;

  constructor(private platform: Platform, private router: Router) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Ocultar la splash screen solo cuando la plataforma está completamente lista
      SplashScreen.hide();
    });
  }


  ngOnInit() {
    console.log('On init APP');
  }

  ngOnDestroy() {
    console.log('On destroy APP');
  }


  shouldShowToolbar(): boolean {
    return this.router.url !== '/splash';
  }

}