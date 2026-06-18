import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login'),
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile'),
  },
  {
    path: 'skills-array',
    loadComponent: () => import('./components/skills-array/skills-array'),
  },
  {
    path: 'submission',
    loadComponent: () => import('./components/submission/submission'),
  },
  {
    path: 'booking-derived',
    loadComponent: () => import('./components/booking-derived/booking-derived'),
  },
  {
    path: 'signals-pitfalls',
    loadChildren: () => import('./components/signals-pitfalls/signals-pitfalls.routes'),
  },
] satisfies Routes;
