import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule, 
    IonicModule,
  ],
  templateUrl: 'listado-imagenes.page.html',
  styleUrls: ['listado-imagenes.page.css'],
})


export class ListadoImagenesPage implements OnInit, OnDestroy {

  router = inject(Router)

  constructor(public authService: AuthService) {}


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  ngOnInit() {
    console.log('On init SUBIDA');

  }

  ngOnDestroy() {
    console.log('On destroy SUBIDA');
  }

}