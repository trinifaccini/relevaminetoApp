import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})


export class HomePage implements OnInit, OnDestroy {

  constructor(public authService: AuthService) {}

  ngOnInit() {
    console.log('On init APP');

    this.authService.user$.subscribe((user: { email: string; displayName: string; }) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
          password: ""
        });
      } else {
        this.authService.currentUserSig.set(null);
      }

      console.log(this.authService.currentUserSig())
    });

  }

  ngOnDestroy() {
    console.log('On destroy APP');
  }

}