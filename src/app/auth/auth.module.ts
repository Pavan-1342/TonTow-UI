import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ForgotPasswordDialog, LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';




@NgModule({
    declarations: [
    PageNotFoundComponent,
    LoginComponent,
    ForgotPasswordDialog
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      AuthRoutingModule,
      MatCardModule,
      MatInputModule,
      MatSnackBarModule,
      HttpClientModule,
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      FlexLayoutModule

    ],
    entryComponents:[ForgotPasswordDialog]
  })
  export class AuthModule { }