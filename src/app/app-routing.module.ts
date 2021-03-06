import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule) },
  { path: 'log', loadChildren: () => import('./log/log.module').then( m => m.LogPageModule), canLoad: [AuthGuard] },
  { path: 'training', loadChildren: () => import('./training/training.module').then( m => m.TrainingPageModule), canLoad: [AuthGuard] },
  { path: 'food', loadChildren: () => import('./food/food.module').then( m => m.FoodPageModule), canLoad: [AuthGuard] },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule), canLoad: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
