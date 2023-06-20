import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guards';

const authModule = () => import('./auth/auth.module').then(m => m.AuthModule);
const layoutModule = () => import('./layout/layout.module').then(m => m.LayoutModule);

const routes: Routes = [
  { path: 'auth', loadChildren: authModule },
  { path: '', loadChildren: layoutModule, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'auth/page-not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
