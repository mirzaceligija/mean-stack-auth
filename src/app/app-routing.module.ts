import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

import {LoginComponent} from './modules/auth/components/login/login.component';
import {RegisterComponent} from './modules/auth/components/register/register.component';
import {ActivationComponent} from './modules/auth/components/activation/activation.component';
import {ProfileComponent} from './modules/auth/components/profile/profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard]},
  { path: 'activate/:token', component: ActivationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
