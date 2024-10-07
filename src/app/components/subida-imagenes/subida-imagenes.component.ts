
import { Component, inject, OnDestroy } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-upload',
  templateUrl: './subida-imagenes.component.html',
  styleUrls: ['./subida-imagenes.component.css'],
  imports: [CommonModule, IonicModule]
})
export class UploadComponent implements OnDestroy {
  
  selectedImages: string[] = []; // Almacena las URLs de las imágenes previsualizadas
  userId: string = '';
  userName: string = '';
  categoria: string;

  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor(private firestore: Firestore, private auth: Auth) {
    this.userId = this.auth.currentUser?.uid || '';
    this.getUserName().then(() => {
      console.log("Nombre de usuario obtenido:", this.userName);
    }).catch((error) => {
      console.error("Error al obtener el nombre de usuario:", error);
    });
    this.categoria = this.route.snapshot.paramMap.get('categoria');
  }

  ngOnDestroy(): void {
    this.selectedImages = [];
  }

  // Método para obtener el nombre del usuario desde Firestore
  async getUserName() {
    const userDocRef = doc(this.firestore, `usuarios/${this.userId}`);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      this.userName = userData['nombre']; // Asume que hay un campo 'nombre' en el documento de usuario
    }
  }

  // Método para tomar una foto con la cámara
  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
  
      if (image && image.dataUrl) {
        console.log("Imagen capturada:", image.dataUrl); // Verifica el formato del dataUrl
        this.selectedImages.push(image.dataUrl); // Almacena la imagen para previsualización
      } else {
        console.error("No se capturó ninguna imagen o el formato es incorrecto.");
      }
    } catch (error) {
      console.error("Error al tomar la foto:", error);
    }
  }

  // Método que se ejecuta cuando el usuario confirma la subida
  async confirmUpload() {
    if (!this.userName) {
      console.error('El nombre de usuario no está disponible todavía. Espera a que se cargue.');
      return;
    }
  
    if (this.selectedImages.length === 0) {
      console.error('No hay imágenes seleccionadas para subir.');
      return;
    }
  
    console.log("Confirmando la subida...");
  
    const uploadPromises = this.selectedImages.map((imageDataUrl, index) => {
      return this.uploadToFirebase(imageDataUrl, `imagen${index}.jpg`);
    });
  
    try {
      await Promise.all(uploadPromises); // Espera todas las subidas
      console.log('Todas las imágenes se han subido correctamente');

      Swal.fire({
        icon: 'success',
        title: '¡Subida completa!',
        text: 'Se han subido correctamente',
        heightAuto: false
      });
      
      this.router.navigate([`subida/${this.categoria}`]); // Navegar una vez completadas
    } catch (error) {
      console.error('Error durante la subida de imágenes:', error);
    }
  }
  

  // Método para subir imágenes a Firebase Storage y luego guardarlas en Firestore
  async uploadToFirebase(dataUrl: string, fileName: string) {
    console.log("Iniciando la subida a Firebase...");
  
    const blob = this.dataURLtoBlob(dataUrl); // Convertir a Blob
    const storage = getStorage();
    const storageRef = ref(storage, `imagenes/${this.userName}_${fileName}`);
  
    const uploadTask = uploadBytesResumable(storageRef, blob);
  
    return new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progreso de subida: ${progress}%`);
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
          reject(error); // Manejo de error en la subida
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Imagen disponible en:', downloadURL);
            await this.saveImageToFirestore(downloadURL, `${this.userName}_${fileName}`);
            resolve(); // Subida exitosa
          } catch (error) {
            console.error('Error al obtener el URL de la imagen:', error);
            reject(error);
          }
        }
      );
    });
  }
  

  // Método para convertir dataURL a Blob
  dataURLtoBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  // Método para guardar la URL de la imagen en Firestore
  async saveImageToFirestore(downloadURL: string, imageName: string) {

    console.log("SAVE IMAGES TO FIRESTORE");

    try {
      const imageCollection = collection(this.firestore, `imagenes-${this.categoria}`); // Referencia a la colección de Firestore
      await addDoc(imageCollection, {
        url: downloadURL, // URL de la imagen subida
        imageName: imageName, // Nombre del archivo
        userId: this.userId, // ID del usuario que subió la imagen
        userName: this.userName, // Nombre del usuario
        timestamp: new Date(), // Fecha de subida
        likesCount: 0 // Inicializa los likes en 0
      });
      console.log('Imagen guardada en Firestore con éxito');
    } catch (error) {
      console.error('Error al guardar la imagen en Firestore:', error);
    }
  }

  // Método para eliminar una imagen de la lista de seleccionadas
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }
}
