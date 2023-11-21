import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from 'src/app/pages/register/componentes/login/login.component';


const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    
  },
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  
  
  {
    path: 'homepage',
    loadChildren: () => import('./pages/homepage/homepage.module').then( m => m.HomePageModule),
    canLoad: [AuthGuard],
  },
  
  {
    path: 'recoverpass',
    loadChildren: () => import('./pages/recoverpass/recoverpass.module').then( m => m.RecoverpassPageModule)
    
  },
  
  {
    path: 'login', 
    component: LoginComponent ,
  },
  
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canLoad: [AuthGuard],
  },
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
