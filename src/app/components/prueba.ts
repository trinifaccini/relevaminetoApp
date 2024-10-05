import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { collection, doc, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';



@Component({
  selector: 'app-prueba',
  standalone: true,
  imports: [CommonModule, IonicModule],

  template: `
  <p *ngIf="mostrarUserId">User ID: {{ userId }}</p>
  <ion-list>
  <ion-item *ngFor="let image of images"> <!-- Sin | async si images no es un Observable -->
    <ion-thumbnail>
      <img [src]="image.url" alt="Imagen">
    </ion-thumbnail>
    <ion-label>
      <h2>{{ image.liked ? '❤️' : '♡' }} Likes: {{ image.likesCount }}</h2>
    </ion-label>
  </ion-item>
</ion-list>
`,
})

export class PruebaComponent implements OnInit {
    @Input() mostrarUserId: boolean = false;
    userId: string | null = null;
    images: any[] = [];  // Initialize as an empty array
    categoria: string = 'feas'; 
  
    authService = inject(AuthService);
  
    constructor(private firestore: Firestore) {}
  
    ngOnInit() {
      this.userId = this.authService.getUserId(); // Get user ID
      this.loadImages(); // Load images based on the user ID
    }
  
    async loadImages() {
      const imagesCollection = collection(this.firestore, `imagenes-${this.categoria}`);
  
      if (this.mostrarUserId === true && this.userId) {
        const q = query(imagesCollection, where('userId', '==', this.userId));
        const snapshot = await getDocs(q);
  
        for (const imageDoc of snapshot.docs) {
          const imageData = imageDoc.data();
          const likeDocRef = doc(this.firestore, `likes-${this.categoria}/${this.userId}_${imageDoc.id}`);
          const likeDocSnap = await getDoc(likeDocRef);
  
          // Add image to the array
          this.images.push({
            id: imageDoc.id,
            url: imageData['url'],
            liked: likeDocSnap.exists(),
            likesCount: imageData['likesCount'] || 0,
          });
        }
      } else {
        // Fetch all images
        const snapshotTodas = await getDocs(imagesCollection);
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
          });
        }
      }
    }
  }
  