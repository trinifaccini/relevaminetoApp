import { Routes } from '@angular/router';
import { SplashPage } from './pages/splash/splash.page';

export const routes: Routes = [

  {
      path: "",
      redirectTo: "splash",
      pathMatch: "full"
  },
  {
    path: "splash",
    component: SplashPage,
  },
  {
    path: "login",
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: "inicio",
    loadComponent: () => import('./pages/inicio/juego.page').then(m => m.GamePage),
  },
  {
    path: "subida/:categoria",
    loadComponent: () => import('./pages/subida/subida.page').then(m => m.SubidaPage),
    data: { shouldReuse: false }
  },
  {
    path: "subirImagenes/:categoria",
    loadComponent: () => import('./pages/subirImagenes/subir-imagenes.page').then(m => m.SubirImagenesPage),
  },
  {
    path: "graficos/:categoria",
    loadComponent: () => import('./components/graficos-likes/graficos-likes.component').then(m => m.LikesChartComponent),

  },
  {
    path: "listado/:categoria",
    loadComponent: () => import('./pages/listado-imagenes/listado-imagenes.page').then(m => m.ListadoImagenesPage),

  },
  { 
    path: '**', 
    redirectTo: "home",
  },
];


  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  // },
  // {
  //   path: 'landing',
  //   loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  // },
  // {
  //   path: 'register',
  //   loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  // },
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  