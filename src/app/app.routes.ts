import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inicio',
    loadComponent: () => import('./inicio/inicio.page').then(m => m.InicioPage)
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'gestion-de-citas',
    loadComponent: () => import('./gestion-de-citas/gestion-de-citas.page').then(m => m.GestionDeCitasPage)
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./configuracion/configuracion.page').then(m => m.ConfiguracionPage)
  },
];
