import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { SignupPageComponent } from './pages/signup/signup.component';
import { HomePageComponent } from './pages/home/home.component';
import { InGamePageComponent } from './pages/in-game/ingamepage.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'game', component: InGamePageComponent, canActivate: [AuthGuard] },
  { path: 'register', component: SignupPageComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }