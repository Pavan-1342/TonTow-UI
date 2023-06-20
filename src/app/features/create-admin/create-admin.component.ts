import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2'
import { mustMatch } from './must-watch.validators';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss'],
})
export class CreateAdminComponent implements OnInit {
  createAdminForm: FormGroup;
  submitted = false;
  hide: boolean = true;
  hideConfirm: boolean = true;
  constructor(private fb: FormBuilder, private httpService: HttpService) {
    this.createAdminForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },{
      validator:mustMatch('password', 'confirmPassword')
  });
  }

  ngOnInit(): void {
    
  }
 
  get confirmPassword() { return this.createAdminForm.get('confirmPassword'); }
  get password() { return this.createAdminForm.get('password'); }

  registeruser() {
    this.submitted = true;
    if (this.createAdminForm.valid) {
      let request = {
        username: this.createAdminForm.value.userId,
        password: this.createAdminForm.value.password,
      };
      this.httpService.registeruser(request).subscribe(
        (res) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              text: 'Admin user added  succcessfully!',
            });
            this.createAdminForm.reset();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Admin user added failed! ',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: error.error,
            text: 'Admin user added failed! ',
          });
        }
      );
    }
  }

  myFunction() {
    this.hide = !this.hide;
  }
}
