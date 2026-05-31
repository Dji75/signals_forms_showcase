import { Routes } from '@angular/router';

export default [
  {
    path: 'async-loss',
    loadComponent: () => import('./async-loss/signals-async-loss')
  },
  {
    path: 'reference-mutation',
    loadComponent: () => import('./reference-mutation/signals-reference-mutation')
  },
  {
    path: 'untracked',
    loadComponent: () => import('./untracked/signals-untracked')
  },
  {
    path: 'effect-writes',
    loadComponent: () => import('./effect-writes/signals-effect-writes')
  }
] satisfies Routes;
