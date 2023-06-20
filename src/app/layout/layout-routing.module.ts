import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../helpers/auth.guards';

const routes:Routes = [
{
    path : '', component: LayoutComponent,
    children:[
        { path: '', loadChildren: () => import('../features/features.module').then(m => m.FeaturesModule)}
    ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class LayoutRoutingModule { }