import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

import { LayoutComponent } from './layout.component';
import { ChangePasswordDialog, HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LayoutRoutingModule } from './layout-routing.module';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatInputModule} from '@angular/material/input';
import { MatCardModule} from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    ChangePasswordDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutRoutingModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    FlexLayoutModule,
  ],
  entryComponents:[ChangePasswordDialog]
})
export class LayoutModule { }
