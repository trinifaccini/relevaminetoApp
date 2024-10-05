import { ApplicationConfig, CUSTOM_ELEMENTS_SCHEMA, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { IonicModule } from '@ionic/angular';


const firebaseConfig = {
  apiKey: "AIzaSyD9EjwtNE9XDa1QPL_iqCVVOCaEAmj1mxk",
  authDomain: "practica-profesional-faccini.firebaseapp.com",
  projectId: "practica-profesional-faccini",
  storageBucket: "practica-profesional-faccini.appspot.com",
  messagingSenderId: "1094929870630",
  appId: "1:1094929870630:web:3fff88f9b26b69e7435be7"
}

// export const appConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }), 
//     provideRouter(routes), 
//     provideClientHydration(), 
//     provideAnimationsAsync('noop'),
//     provideFirebaseApp(() => initializeApp(firebaseConfig)),
//     provideAuth(() => getAuth()),
//     provideStorage(() => getStorage()),
//     importProvidersFrom(IonicModule.forRoot()), // Proveer HttpClientModule
//     provideFirestore(() => getFirestore()),
//     importProvidersFrom(HttpClientModule), provideAnimationsAsync('noop'), provideAnimationsAsync('noop') // Proveer HttpClientModule
//   ],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]

// };


import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { CustomRouteReuseStrategy } from './custom-route-reuse.strategy';

export const appConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),

    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync('noop'),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    importProvidersFrom(IonicModule.forRoot()), // Proveer HttpClientModule
    provideFirestore(() => getFirestore()),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }  // Proporciona la estrategia personalizada
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};

