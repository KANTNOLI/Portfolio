import { Routes } from '@angular/router';
import { ScreenComponent } from './screen/screen.component';

export const routes: Routes = [
  { path: '', component: ScreenComponent },
  { path: 'asd', component: ScreenComponent },
  { path: 'error', component: ScreenComponent },

  { path: '**', redirectTo: '/error', pathMatch: 'full' },
];
