
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Chart, ChartEvent } from 'chart.js/auto';


@Component({
  standalone: true,
  selector: 'app-graficos-likes',
  templateUrl: './graficos-likes.component.html',
  styleUrls: ['./graficos-likes.component.css'],
  imports: [CommonModule, IonicModule]
})

export class LikesChartComponent implements OnInit {

  chart: any; // Variable para el gráfico
  route = inject(ActivatedRoute)
  categoria:string;
  selectedImage: string | undefined; // Para almacenar la imagen seleccionada

  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    this.categoria = this.route.snapshot.paramMap.get('categoria') || '';

    this.loadLikesData();

  }

  // Cargar los datos de "likes" desde Firestore
  async loadLikesData() {
    const querySnapshot = await getDocs(collection(this.firestore, 'imagenes-feas'));

    const imageLabels: string[] = [];   // Nombre o ID de la imagen
    const likesData: number[] = [];     // Cantidad de likes de cada imagen

    querySnapshot.forEach((doc) => {
      const imageData = doc.data();
      imageLabels.push(imageData['url']); // Puedes usar el nombre o ID de la imagen
      likesData.push(imageData['likesCount'] || 0); // Contador de "likes"
    });

    // Crear el gráfico con los datos obtenidos
    this.createChart(imageLabels,likesData);
  }

  createChart(labels: string[], data: number[]) {
    const tipo = this.categoria === 'feas' ? 'bar' : 'pie';
  
    const ctx = document.getElementById('likesChart') as HTMLCanvasElement;
  
    // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
    if (this.chart) {
      this.chart.destroy();
    }
  
    const options: any = {
      responsive: true,
      plugins: {
        legend: {
          display: tipo !== 'pie' // Ocultar leyenda para gráficos de torta
        }
      },
      onClick: (event: ChartEvent, elements: any[]) => {
        if (elements.length > 0) {
          const index = elements[0].index; // Índice de la imagen seleccionada
          this.displayImage(labels[index]); // Mostrar la imagen correspondiente
        }
      }
    };
  
    if (tipo === 'bar') {
      options.scales = {
        x: {
          display: false // Ocultar etiquetas del eje X
        },
        y: {
          ticks: {
              // Muestra solo números enteros
              stepSize: 1,
              callback: function(value) {
                  return Number.isInteger(value) ? value : '';
              }
          },
          beginAtZero: true
      }
      };
    }

  
    this.chart = new Chart(ctx, {
      type: tipo,
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de Me Gusta',
          data: data,
          backgroundColor: tipo === 'pie' ? [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ] : 'rgba(75, 192, 192, 0.2)',
          borderColor: tipo === 'pie' ? [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ] : 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: options
    });
  }
// Función para mostrar la imagen
displayImage(imageLabel: string): void {
  // Asume que las imágenes tienen nombres relacionados con las etiquetas
  this.selectedImage = imageLabel 
}
}
  

