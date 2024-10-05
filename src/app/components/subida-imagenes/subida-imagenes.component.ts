import { Component, inject, Input } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Firestore, doc, getDoc, collection, addDoc } from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true, 
  selector: 'app-upload',
  templateUrl: './subida-imagenes.component.html',
  styleUrls: ['./subida-imagenes.component.css'],
  imports: [CommonModule]
})


export class UploadComponent {

  selectedFiles: File[] = []; // Almacena las imágenes seleccionadas
  selectedImages: string[] = []; // Almacena las URLs para previsualización
  userId: string = ''; // Aquí guardarás el ID del usuario autenticado
  userName: string = ''; // Aquí guardarás el nombre del usuario
  categoria: string; 

  router = inject(Router)
  route = inject(ActivatedRoute)

  
  constructor(private firestore: Firestore, private auth: Auth) {
    this.userId = this.auth.currentUser?.uid || ''; // Obtén el ID del usuario autenticado
    this.getUserName(); // Llamamos al método para obtener el nombre del usuario
    this.categoria = this.route.snapshot.paramMap.get('categoria');    

  }

  // Método para obtener el nombre del usuario desde Firestore
  async getUserName() {
    const userDocRef = doc(this.firestore, `usuarios/${this.userId}`);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      this.userName = userData['nombre']; // Aquí asumes que el documento de usuario tiene un campo 'nombre'
    }
  }

  // Método para manejar la selección de imágenes
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = []; // Limpia las imágenes seleccionadas previamente
    this.selectedImages = []; // Limpia las previsualizaciones

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result); // Muestra las imágenes seleccionadas en la vista
      };
      reader.readAsDataURL(files[i]);
      this.selectedFiles.push(files[i]); // Almacena los archivos seleccionados
    }
  }

  // Método que se ejecuta cuando el usuario confirma la subida
  confirmUpload() {
    for (let file of this.selectedFiles) {
      this.uploadToFirebase(file); // Llama al método para subir la imagen a Firebase
    }

      this.router.navigate([`subida/${this.categoria}`], { replaceUrl: true });  // Forzar recarga de la página


  }

  // Método para subir imágenes a Firebase Storage y luego guardarlas en Firestore
  async uploadToFirebase(file: File) {
    if (!this.userName) {
      console.error('El nombre de usuario no está disponible todavía');
      return;
    }

    const storage = getStorage();

    // Crear un nombre de archivo único con el nombre del usuario y el nombre del archivo original
    const fileName = `${this.userName}_${file.name}`;
    const storageRef = ref(storage, `imagenes/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Progreso de subida: ' + progress + '%');
      },
      (error) => {
        console.error('Error al subir la imagen: ', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log('Imagen disponible en:', downloadURL);

          // Guardar la URL en Firestore
          await this.saveImageToFirestore(downloadURL, fileName);
        });
      }
    );
  }

  // Método para guardar la URL de la imagen en Firestore
  async saveImageToFirestore(downloadURL: string, imageName: string) {
    try {
      const imageCollection = collection(this.firestore, `imagenes-${this.categoria}`); // Referencia a la colección de Firestore
      await addDoc(imageCollection, {
        url: downloadURL,  // URL de la imagen subida
        imageName: imageName,   // Nombre del archivo que incluye el nombre de usuario
        userId: this.userId,    // ID del usuario que subió la imagen
        userName: this.userName, // Nombre del usuario
        timestamp: new Date(),  // Fecha de subida
        likesCount: 0,          // Inicializa los likes en 0
      });
      console.log('Imagen guardada en Firestore con éxito');
    } catch (error) {
      console.error('Error al guardar la imagen en Firestore:', error);
    }
  }
}