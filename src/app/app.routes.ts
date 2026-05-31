import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Profile } from './components/profile/profile';
import { SkillsArray } from './components/skills-array/skills-array';
import { Submission } from './components/submission/submission';
import { BookingDerived } from './components/booking-derived/booking-derived';
import { SignalsAsyncLoss } from './components/signals-pitfalls/signals-async-loss';
import { SignalsReferenceMutation } from './components/signals-pitfalls/signals-reference-mutation';
import { SignalsUntracked } from './components/signals-pitfalls/signals-untracked';
import { SignalsEffectWrites } from './components/signals-pitfalls/signals-effect-writes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile },
  { path: 'skills-array', component: SkillsArray },
  { path: 'submission', component: Submission },
  { path: 'booking-derived', component: BookingDerived },
  { path: 'signals-async-loss', component: SignalsAsyncLoss },
  { path: 'signals-reference-mutation', component: SignalsReferenceMutation },
  { path: 'signals-untracked', component: SignalsUntracked },
  { path: 'signals-effect-writes', component: SignalsEffectWrites }
];
