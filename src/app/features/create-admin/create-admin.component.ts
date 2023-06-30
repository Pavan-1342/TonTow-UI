import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2'
import { mustMatch } from './must-watch.validators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss'],
})
export class CreateAdminComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('f') myNgForm: any;
  createAdminForm: FormGroup;
  submitted = false;
  hide: boolean = true;
  hideConfirm: boolean = true;
  allAdminUsersData: any;
  displayedColumns: string[] = ['userId', 'username', 'edit'];
  dataSource = new MatTableDataSource<any>();
  initialDataSource: any;
  deactivateSelectedAdminUser: any;
  loginUserDetails: any;

  constructor(private fb: FormBuilder, private httpService: HttpService) {
    this.createAdminForm = this.fb.group(
      {
        userId: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: mustMatch('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {
   // this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.getAdminUsers();
  }

  get confirmPassword() {
    return this.createAdminForm.get('confirmPassword');
  }
  get password() {
    return this.createAdminForm.get('password');
  }

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
            this.getAdminUsers();
            this.myNgForm.resetForm();
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

  getAdminUsers() {
    this.httpService.getAdminUsers().subscribe((res) => {
      let data: any = [];
      res.forEach((Object: any) => {
        data.push({
          Id: Object.userId,
          adminUser: Object.username,
          status: Object.status,
          isEdit: false,
        });
      });
      this.initialDataSource = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    //this.cdr.detectChanges();
  }

  highlight(element: any) {
    element.highlighted = !element.highlighted;
  }

  deactivateAdminUser() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to deactivate!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, deactivate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService
          .deactivateAdminUser(this.deactivateSelectedAdminUser)
          .subscribe(
            (res) => {
              if (res) {
                Swal.fire({
                  icon: 'success',
                  text: 'Admin User deactivated  succcessfully!',
                });
                this.getAdminUsers();
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Admin User deactivated failed! ',
                });
              }
            },
            (error) => {}
          );
      }
    });
  }

  onClickOfDeactivate(record: any, i: number) {
    this.deactivateSelectedAdminUser = record.Id;
    this.deactivateAdminUser();
  }
}
