import { Component, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login.page';4
import { IonicModule } from '@ionic/angular';
import { ListadoImagenesComponent } from 'src/app/components/listado-imagenes/listado-imagenes.component';
import { UploadComponent } from 'src/app/components/subida-imagenes/subida-imagenes.component';
import { Firestore, doc, getDoc, getDocs, collection, orderBy, query } from '@angular/fire/firestore';


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
    UploadComponent,
    RouterModule
  ],
  templateUrl: './subida.page.html',
  styleUrl: './subida.page.css',
})


export class SubidaPage implements OnInit, OnDestroy {

  router = inject(Router)
  route = inject(ActivatedRoute)
  authService = inject(AuthService)

  images: any[] = [];
  categoria: string;
  mostrarUserId: boolean = false;
  userId: string;
  loading: boolean = true;

  constructor(private firestore: Firestore, ) {}


  async loadImages() {
    this.images = [];  // Reiniciar el array de imágenes
    this.images = [];  // Reiniciar el array de imágenes
    
    const imagesCollection = collection(this.firestore, `imagenes-${this.categoria}`);

    // Consulta para ordenar por timestamp de manera descendente (más reciente primero)
    const q = query(imagesCollection, orderBy('timestamp', 'desc'));

    const snapshotTodas = await getDocs(q);
    for (const imageDoc of snapshotTodas.docs) {
      const imageData = imageDoc.data();
      const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${this.userId}_${imageDoc.id}`);
      const likeDocSnap = await getDoc(likeDocRef);

      // Add image to the array
      this.images.push({
        id: imageDoc.id,
        url: imageData['url'],
        liked: likeDocSnap.exists(),
        likesCount: imageData['likesCount'] || 0,
        imageName: imageData['imageName']
      });

      this.loading = false;

    }

    this.loading = false;


  }


  ngOnInit() {
    console.log('On init SUBIDA PAGE');
    this.userId = this.authService.getUserId(); // Get user ID
    this.categoria = this.route.snapshot.paramMap.get('categoria') || '';
  }

  ngOnDestroy() {
    console.log('On destroy SUBIDA PAGE');
    this.loading = true;
    this.images = []
  }


  ionViewWillEnter() {

    console.log('On VIEW WILL ENTER SUBIDA PAGE');

    setTimeout(() => {
      this.loadImages();
    }, 3000);  // 3 segundos de retraso
  }

  ionViewDidLeave() {

    console.log('On VIEW WILL LEAVE SUBIDA PAGE');
    this.loading = true;
    this.images = []
    
  }


  navegar(pagina) {
    this.router.navigate([`/${pagina}/${this.categoria}`]);
    
  }

}