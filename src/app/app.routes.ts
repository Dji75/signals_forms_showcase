import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Profile } from './components/profile/profile';
import { SkillsArray } from './components/skills-array/skills-array';
import { Submission } from './components/submission/submission';
import { BookingDerived } from './components/booking-derived/booking-derived';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile },
  { path: 'skills-array', component: SkillsArray },
  { path: 'submission', component: Submission },
  { path: 'booking-derived', component: BookingDerived }
];
