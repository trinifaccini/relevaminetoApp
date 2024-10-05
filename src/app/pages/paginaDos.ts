import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PruebaComponent } from '../components/prueba';

@Component({
  selector: 'app-pagina-dos',
  imports: [CommonModule, IonicModule, PruebaComponent],
  template: `
    <app-prueba [mostrarUserId]="true"></app-prueba>
  `,
  standalone: true,
})
export class PaginaDosComponent {}
