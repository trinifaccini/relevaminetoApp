import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PruebaComponent } from '../components/prueba';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pagina-uno',
  imports: [CommonModule, IonicModule, PruebaComponent],
  template: `
    <app-prueba [mostrarUserId]="false"></app-prueba>
    <ion-button (click)="irAPaginaDos()">Ir a Página Dos</ion-button>
  `,
  standalone: true,
})

export class PaginaUnoComponent {
  constructor(private router: Router) {}

  irAPaginaDos() {
    this.router.navigate(['/pagina-dos']);
  }
}
