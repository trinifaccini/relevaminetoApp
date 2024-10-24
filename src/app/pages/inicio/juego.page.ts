import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login.page';4
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    LoginPage,
    CommonModule, 
    IonicModule
  ],
  templateUrl: './juego.page.html',
  styleUrl: './juego.page.css',
})


export class GamePage implements OnInit, OnDestroy {

  router = inject(Router)

  constructor(public authService: AuthService) {}


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  ngOnInit() {
    console.log('On init INICIO');

  }

  ngOnDestroy() {
    console.log('On destroy INICIO');
  }


  redirect(page): void {
    this.router.navigate([`/subida/${page}`]);
  }


}