import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login.page';4
import { IonicModule } from '@ionic/angular';
import { ListadoImagenesComponent } from 'src/app/components/listado-imagenes/listado-imagenes.component';
import { UploadComponent } from 'src/app/components/subida-imagenes/subida-imagenes.component';


@Component({
  selector: 'subida',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    LoginPage,
    CommonModule, 
    IonicModule,
    ListadoImagenesComponent,
    UploadComponent
  ],
  templateUrl: './subida.page.html',
  styleUrl: './subida.page.css',
})


export class SubidaPage implements OnInit, OnDestroy {

  router = inject(Router)
  route = inject(ActivatedRoute)

  categoria: string;
  mostrarUserId: boolean = false;


  // logout(): void {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }

  ngOnInit() {
    console.log('On init SUBIDA PAGE');
    this.categoria = this.route.snapshot.paramMap.get('categoria') || '';
  }

  ngOnDestroy() {
    console.log('On destroy SUBIDA PAGE');
  }

  navegar(pagina) {

    this.router.navigate([`/${pagina}/${this.categoria}`], { replaceUrl: true });


    
  }

}