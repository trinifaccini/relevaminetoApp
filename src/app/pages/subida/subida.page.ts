import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
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
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})


export class SubidaPage implements OnInit {

  router = inject(Router)
  route = inject(ActivatedRoute)
  authService = inject(AuthService)

  images: any[] = [];
  categoria: string;
  userId: string;
  loading: boolean = false;

  constructor(private firestore: Firestore, private cd: ChangeDetectorRef) {}

  async loadImages() {
    if (this.loading) {
      return; // Evita duplicaciones si ya está cargando
    }

    this.loading = true;
    this.images = [];  // Reiniciar el array de imágenes

      const imagesCollection = collection(this.firestore, `imagenes-${this.categoria}`);
      console.log("Colección de imágenes:", imagesCollection);

      const q = query(imagesCollection, orderBy('timestamp', 'desc'));
      const snapshotTodas = await getDocs(q);
      console.log("Resultados de la query:", snapshotTodas);
          for (const imageDoc of snapshotTodas.docs) {
      const imageData = imageDoc.data();
      const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${this.userId}_${imageDoc.id}`);
      const likeDocSnap = await getDoc(likeDocRef);

      this.images.push({
        id: imageDoc.id,
        url: imageData['url'],
        liked: likeDocSnap.exists(),
        likesCount: imageData['likesCount'] || 0,
        imageName: imageData['imageName'],
        userName: imageData['userName'],
        timestamp: imageData['timestamp']
      });
    }

    // Forzar la detección de cambios
    this.cd.detectChanges();

    console.log(this.images);

    this.loading = false;
  }

 

  ngOnInit() {
    console.log('On init SUBIDA PAGE');
    this.userId = this.authService.getUserId(); // Get user ID
    this.categoria = this.route.snapshot.paramMap.get('categoria') || '';
  }


  ionViewWillEnter() {

    console.log('On VIEW WILL ENTER SUBIDA PAGE');
    this.loadImages();
    
  }

  ionViewDidLeave() {

    console.log('On VIEW WILL LEAVE SUBIDA PAGE');
    this.loading = false;
    this.images = []
    
  }


  navegar(pagina) {
    this.router.navigate([`/${pagina}/${this.categoria}`]);
    
  }

}