import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { SplashPage } from './pages/splash/splash.page';
import { GamePage } from './pages/inicio/juego.page';
import { SubidaPage } from './pages/subida/subida.page';
import { LikesChartComponent } from './components/graficos-likes/graficos-likes.component';

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
    component: LoginPage,
  },
  {
    path: "inicio",
    component: GamePage,
  },
  {
    path: "subida/:categoria",
    component: SubidaPage,
  },
  {
    path: "graficos",
    component: LikesChartComponent,
  },
  { 
      path: '**', 
      redirectTo: "home",
  }
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
  