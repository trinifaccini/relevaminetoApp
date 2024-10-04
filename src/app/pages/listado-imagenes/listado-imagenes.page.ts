import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IonicModule } from '@ionic/angular';
import { ListadoImagenesComponent } from 'src/app/components/listado-imagenes/listado-imagenes.component';


@Component({
  selector: 'home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule, 
    IonicModule,
    ListadoImagenesComponent
  ],
  templateUrl: 'listado-imagenes.page.html',
  styleUrls: ['listado-imagenes.page.css'],
})


export class ListadoImagenesPage implements OnInit, OnDestroy {

  router = inject(Router)
  route = inject(ActivatedRoute)

  categoria: string;
  user: boolean = true;


  ngOnInit() {
    console.log('On init LISTADO PROPIO PAGE');
    this.categoria = this.route.snapshot.paramMap.get('categoria') || '';    
  }

  ngOnDestroy() {
    console.log('On destroy LISTADO PROPIO PAGE ');
  }


  ionViewWillEnter() {
    console.log("Página activada LISTADO PROPIO");
    // Aquí puedes cargar los datos o hacer cualquier lógica que necesites al entrar en la página
  }

  ionViewWillLeave() {
    console.log("Página desactivada LISTADO PROPIO");
    // Aquí puedes limpiar cualquier recurso o cancelar suscripciones
  }

}