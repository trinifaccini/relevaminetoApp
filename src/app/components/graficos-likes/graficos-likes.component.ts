
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Chart } from 'chart.js/auto';


@Component({
  standalone: true,
  selector: 'app-graficos-likes',
  templateUrl: './graficos-likes.component.html',
  styleUrls: ['./graficos-likes.component.css'],
})

export class LikesChartComponent implements OnInit {

  chart: any; // Variable para el gráfico

  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    this.loadLikesData();
  }

  // Cargar los datos de "likes" desde Firestore
  async loadLikesData() {
    const querySnapshot = await getDocs(collection(this.firestore, 'imagenes-feas'));

    const imageLabels: string[] = [];   // Nombre o ID de la imagen
    const likesData: number[] = [];     // Cantidad de likes de cada imagen

    querySnapshot.forEach((doc) => {
      const imageData = doc.data();
      imageLabels.push('1'); // Puedes usar el nombre o ID de la imagen
      likesData.push(imageData['likesCount'] || 0); // Contador de "likes"
    });

    // Crear el gráfico con los datos obtenidos
    this.createChart(imageLabels,likesData);
  }

  // Crear el gráfico con Chart.js
  createChart(labels: string[], data: number[]) {
    const ctx = document.getElementById('likesChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // Nombre o ID de la imagen
        datasets: [{
          label: '# of Likes',
          data: data, // Cantidad de likes de cada imagen
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

