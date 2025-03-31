import { Routes } from '@angular/router';
import { ScreenComponent } from './screen/screen.component';
import { ErrorComponent } from './error/error.component';

export const routes: Routes = [
  { path: '', component: ScreenComponent },
  { path: 'asd', component: ScreenComponent },
  { path: 'error', component: ErrorComponent },

  { path: '**', redirectTo: '/error', pathMatch: 'full' },
];
 