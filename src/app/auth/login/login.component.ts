import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { LoginParam } from '../auth.model';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm! : FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  errorMessage: any;
  submitted: boolean= false;
  token: any;
  hide: boolean = true;

  constructor(private fb:FormBuilder, private authService: AuthService, private router:Router,  private snackBar: MatSnackBar,private _matDialog:MatDialog) { 

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username : ['',[Validators.required]],
      password: ['',[Validators.required]]
    })
  }

  submit(formValue:LoginParam){
    this.loginForm.markAllAsTouched();
    let login = {
      "userName": this.loginForm.value.username,
      "password": this.loginForm.value.password,
    }
    this.errorMessage = null;
    this.submitted = true;
    this.authService.login(login).subscribe((res) => {
      if (res.token) {
        this.router.navigate(['dashboard']);
          this.snackBar.open('Login succcessfully', 'close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
      } else {
        
        this.snackBar.open('Login failed', 'close', {
                duration: 2000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
              });
      }
  
    },(error)=>{
      this.snackBar.open(error.error, 'close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    })
  }

  openForgotPasswordDialog(){
    this._matDialog.open(ForgotPasswordDialog,{
      data:"",
    })
  }

  myFunction() {
    this.hide = !this.hide;
  }

}


@Component({
  selector: 'forgotPassword-dialog',
  templateUrl: './forgotPassword-dialog.html',
  styleUrls: ['./login.component.scss']
})
export class ForgotPasswordDialog {
  forgotPasswordForm : FormGroup
  loginUserDetails: any;

  constructor(public dialogRef: MatDialogRef<ForgotPasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private httpService: HttpService,private fb: FormBuilder,private _matDialog:MatDialog) {
      this.forgotPasswordForm = this.fb.group({
        forgotPassword:['']
      })
  }

  forgotPassword(){
    this.httpService.forgetPassword(this.forgotPasswordForm.value.forgotPassword).subscribe((res)=>{
      if (res.result === 'Success') {
        Swal.fire({
          icon: 'success',
          text: 'New Password sent to ur Email!',
        })
        this.dialogRef.close()
      }
    },(error)=>{
      Swal.fire({
        icon: 'error',
        title: error.error,
        text: 'Mail sent failed!',
      });
    })
  }

  closePopup() {
    this.dialogRef.close();
  }
}
