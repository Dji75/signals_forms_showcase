import { Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { delay } from 'rxjs/operators';

export default [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login'),
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile'),
    providers: [
      provideHttpClient(
        withInterceptors([
          (req, next) => {
            // Simulate an API call taking 3 seconds to check if a username is taken
            if (req.url.includes('/api/taken-usernames.json')) {
              return next(req).pipe(delay(3000));
            }
            return next(req);
          },
        ])
      ),
    ],
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
    path: 'angular22-features',
    loadComponent: () => import('./components/angular22-features/angular22-features'),
  },
  {
    path: 'signals-pitfalls',
    loadChildren: () => import('./components/signals-pitfalls/signals-pitfalls.routes'),
  },
] satisfies Routes;
