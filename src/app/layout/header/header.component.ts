import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';
import { FormGroup,FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  avatar:any;
  loginUser: any;
  loginUserDetails: any;

  constructor(private router:Router,private _matDialog:MatDialog) {
     this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
   }

  ngOnInit(): void {
   
  }

  logOut(){
    sessionStorage.removeItem('user');
    this.router.navigate(['/auth']);
  }

  openDialog(){
    this._matDialog.open(ChangePasswordDialog,{
      data:"",
    })
  }

}


@Component({
  selector: 'changePassword-dialog',
  templateUrl: './changePassword-dialog.html',
  styleUrls: ['./header.component.scss']
})
export class ChangePasswordDialog {
  changePasswordForm : FormGroup
  loginUserDetails: any;

  constructor(public dialogRef: MatDialogRef<ChangePasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private httpService: HttpService,private fb: FormBuilder,private _matDialog:MatDialog) {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.changePasswordForm = this.fb.group({
      oldPassword : [''],
      newPassword : [''],
      confirmPassword:['']

    })
  }

  changePassword(){
    let request = {
      username: this.loginUserDetails.username,
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword,
      confirmPassword: this.changePasswordForm.value.confirmPassword,
    };
    this.httpService.changePassword(request).subscribe(
      (res) => {
        if(res.result === "Success"){
          Swal.fire({
            icon: 'success',
            text: 'New Password updated Successfully',
          })
          this.dialogRef.close()
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: error.error,
          text: 'New Password updated failed!',
        });
        this.dialogRef.close()
      }
    );
  }

  closePopup() {
    this.dialogRef.close();
  }
}