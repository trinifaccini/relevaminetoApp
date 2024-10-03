// src/app/components/image-list/image-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface Image {
  url: string;
  liked: boolean;
}

@Component({
  selector: 'listado-imagenes',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: 'listado-imagenes.component.html',
  styleUrls: ['listado-imagenes.component.css'],
})

export class ListadoImagenesComponent implements OnInit {

  images: Image[] = [];

  ngOnInit() {
    // Definimos las imágenes locales dentro del componente
    this.images = [
      { url: '../../assets/img/feo.jpg', liked: false },
      { url: '../../assets/img/feo.jpg', liked: false },
      { url: '../../assets/img/feo.jpg', liked: false },
      { url: '../../assets/img/feo.jpg', liked: false },
      { url: '../../assets/img/feo.jpg', liked: false },
      { url: '../../assets/img/feo.jpg', liked: false },
      { url: '../../assets/img/feo.jpg', liked: false },
      { url: '../../assets/img/feo.jpg', liked: false },
      { url: '../../assets/img/feo.jpg', liked: false },
      { url: '../../assets/img/feo.jpg', liked: false },

    ];
  }

  toggleLike(image: Image) {
    image.liked = !image.liked;
  }
}
