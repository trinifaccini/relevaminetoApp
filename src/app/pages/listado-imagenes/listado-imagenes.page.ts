import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IonicModule } from '@ionic/angular';
import { ListadoImagenesComponent } from 'src/app/components/listado-imagenes/listado-imagenes.component';
import { Firestore, doc, getDoc, getDocs, collection, query, orderBy } from '@angular/fire/firestore';


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
  authService = inject(AuthService)

  images: any[] = [];
  categoria: string;
  mostrarUserId: boolean = true;
  userId: string;
  loading: boolean = true;


  constructor(private firestore: Firestore, ) {}


  ngOnInit() {
    console.log('On init LISTADO PROPIO PAGE');
    this.userId = this.authService.getUserId(); // Get user ID
    this.categoria = this.route.snapshot.paramMap.get('categoria');    
  }


  ngOnDestroy() {
    console.log('On destroy LISTADO PROPIO PAGE ');
    this.loading = true;
    this.images = []
  }


  ionViewWillEnter() {

    console.log('On VIEW WILL ENTER LISTADO PROPIO PAGE');

    setTimeout(() => {
      this.loadImages();
    }, 3000);  // 3 segundos de retraso
  }

  ionViewDidLeave() {

    console.log('On VIEW WILL EXIT LISTADO PROPIO PAGE');
    this.loading = true;
    this.images = []
    
  }




  // FUNCIONES 

  async loadImages() {
    this.images = [];  // Reiniciar el array de imágenes
    
    const imagesCollection = collection(this.firestore, `imagenes-${this.categoria}`);

    // Consulta para ordenar por timestamp de manera descendente (más reciente primero)
    const q = query(imagesCollection, orderBy('timestamp', 'desc'));

    const snapshotTodas = await getDocs(q);
    for (const imageDoc of snapshotTodas.docs) {
      const imageData = imageDoc.data();
      const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${this.userId}_${imageDoc.id}`);
      const likeDocSnap = await getDoc(likeDocRef);

      if(imageData['userId'] == this.userId){
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
  }




}