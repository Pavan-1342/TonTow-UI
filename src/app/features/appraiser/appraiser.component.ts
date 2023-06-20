import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { Observable, elementAt } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appraiser',
  templateUrl: './appraiser.component.html',
  styleUrls: ['./appraiser.component.scss'],
})
export class AppraiserComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('f') myNgForm: any;
  displayedColumns: string[] = [
    'tonTowRptId',
    'appraiserName',
    'appraiserDate',
    'companyName',
    'claim',
    'contactAddress',
    'contactPhone',
    'vehicleCondition',
    'edit',
  ];
  dataSource = new MatTableDataSource<any>();
  table: any;
  //showCreateAppraiserForm: boolean = false;
  appraiserForm!: FormGroup;
  userAppraiserDetails: any;
  loginUserDetails: any;
  tonTowReportId: any;
  appraiserTableForm!: FormGroup;
  @Input() tonTowReportDropdownDetails: any;
  filteredOptions!: Observable<any[]>;
  duplicateAppraiserDetails: any;
  initialDataSource: any;
  initialTableDataArray: any;
  selectedAppraiser: any;
  checkAdjusterRecords: any;
  allAppraiserDetails: any;

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.tonTowReportId = this.loginUserDetails?.tonTowRptId;
    this.appraiserForm = this.fb.group({
      tonTowReport: ['',[Validators.required]],
      appraiserName: ['', [Validators.required, Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]], 
      appraisedDate: ['', Validators.required],
      companyName: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      claim: ['', [Validators.required, Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      contactAddress: ['', [Validators.required, Validators.maxLength(150),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      contactPhone: ['', [Validators.required, Validators.maxLength(15),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      vehicleCondition: ['', [Validators.required, Validators.maxLength(25),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
    });
    this.appraiserTableForm = this.fb.group({
      appraiserRows: this.fb.array([]),
    });
    this.getAllAppraiser();
    if (this.loginUserDetails?.role === 'A') {
    this.filteredOptions = this.tonTowReportDropdownDetails;
    this.filteredOptions = this.appraiserForm.controls[
      'tonTowReport'
    ]?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    let resultArray = [];
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    let array = this.initialTableDataArray;
    resultArray = array.filter((obj: any) =>
      JSON.stringify(obj)
        .toLowerCase()
        .includes(
          typeof filterValue === 'string'
            ? filterValue
            : JSON.stringify(filterValue)
        )
    );
    if (resultArray.length === 0 || filterValue === '') {
      resultArray = [];
      this.initialDataSource.filteredData.forEach((element: any) => {
        resultArray.push(element.value);
      });
    }

    this.appraiserTableForm = this.fb.group({
      appraiserRows: this.fb.array(
        resultArray?.map((obj: any) =>
          this.fb.group({
            id: new FormControl(obj.id),
            tonTowReport: new FormControl(obj.tonTowReport),
            appraiserName: new FormControl(obj.appraiserName,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            appraisedDate: new FormControl(obj.appraisedDate,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            companyName: new FormControl(obj.companyName,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            claim: new FormControl(obj.claim,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            contactAddress: new FormControl(obj.contactAddress,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            contactPhone: new FormControl(obj.contactPhone,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            vehicleCondition: new FormControl(obj.vehicleCondition,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            isEditable: new FormControl(obj.isEditable),
          })
        )
      ),
    });

    this.dataSource = new MatTableDataSource(
      (this.appraiserTableForm.get('appraiserRows') as FormArray).controls
    );
    this.dataSource.paginator = this.paginator;
  }

  // addReport() {
  //   this.showCreateAppraiserForm = true;
  // }

  getAllAppraiser() {
    this.httpService.getAllAppraiser().subscribe((res) => {
      this.allAppraiserDetails = res;
      this.appraiserTableForm = this.fb.group({
        appraiserRows: this.fb.array(
          res?.map((val: any) =>
            this.fb.group({
              id: new FormControl(val.appraiser.id),
              tonTowReport: new FormControl(val.jobNum),
              appraiserName: new FormControl(val.appraiser.appraiserName,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              appraisedDate: new FormControl(val.appraiser.appraisedDate,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              companyName: new FormControl(val.appraiser.companyName,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              claim: new FormControl(val.appraiser.claim,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              contactAddress: new FormControl(val.appraiser.contactAddress,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              contactPhone: new FormControl(val.appraiser.contactPhone,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              vehicleCondition: new FormControl(val.appraiser.vehicleCondition,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              isEditable: new FormControl(true),
            })
          )
        ),
      });
      this.initialTableDataArray = this.appraiserTableForm.value.appraiserRows;
      this.initialDataSource = new MatTableDataSource(
        (this.appraiserTableForm.get('appraiserRows') as FormArray).controls
      );
      this.dataSource = new MatTableDataSource(
        (this.appraiserTableForm.get('appraiserRows') as FormArray).controls
      );
      this.dataSource.paginator = this.paginator;
    });
  }

  addAppraiser() {
    this.appraiserForm.markAllAsTouched();
    if (this.appraiserForm.valid) {
      let request = {
        tonTowRptId: this.appraiserForm.value.tonTowReport.tonTowRptId,
        appraiserName: this.appraiserForm.value.appraiserName,
        appraisedDate: this.appraiserForm.value.appraisedDate,
        companyName: this.appraiserForm.value.companyName,
        claim: String(this.appraiserForm.value.claim),
        contactAddress: this.appraiserForm.value.contactAddress,
        contactPhone: String(this.appraiserForm.value.contactPhone),
        vehicleCondition: this.appraiserForm.value.vehicleCondition,
        createdBy: this.loginUserDetails.username,
      };
      this.httpService.addAppraiser(request).subscribe(
        (res) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              text: 'Appraiser details added successfully!',
            });
            this.getAllAppraiser();
            this.myNgForm.resetForm();
            // Object.keys(this.appraiserForm.controls).forEach((key) => {
            //   this.appraiserForm.controls[key].setErrors(null);
            // });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Appraiser details failed to add! ',
            });
          }
        },
        (error) => {}
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all mandatory fields! ',
      });
    }
  }

  deleteAppraiser(i: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let request = {
          id: this.appraiserTableForm.value.appraiserRows[i].id,
          modifiedBy: this.loginUserDetails.username,
        };
        this.httpService.deleteAppraiser(request).subscribe(
          (res) => {
            if (res) {
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
              this.snackBar.open('Appraiser details deleted', 'close', {
                //duration: 2000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
              });
              this.getAllAppraiser();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Appraiser details delete failed!',
              });
            }
          },
          (error) => {}
        );
      }
    });
  }

  getUserAppraiser(tonTowReportId: any) {
    this.httpService.getUserAppraiser(tonTowReportId).subscribe(
      (res) => {
        this.userAppraiserDetails = res;
      },
      (error) => {
        this.snackBar.open(error.error, 'close', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }
    );
  }

  // onClose() {
  //   this.showCreateAppraiserForm = false;
  // }

  updateAppraiser(i: number) {
    this.appraiserTableForm.markAllAsTouched();
    let allRowsControls = (this.appraiserTableForm.get('appraiserRows') as FormArray).controls
    if (allRowsControls[i].valid) {
    let request = {
      id: this.appraiserTableForm.value.appraiserRows[i].id,
      appraiserName:
        this.appraiserTableForm.value.appraiserRows[i].appraiserName,
      appraisedDate:
        this.appraiserTableForm.value.appraiserRows[i].appraisedDate,
      companyName: this.appraiserTableForm.value.appraiserRows[i].companyName,
      claim: String(this.appraiserTableForm.value.appraiserRows[i].claim),
      contactAddress:
        this.appraiserTableForm.value.appraiserRows[i].contactAddress,
      contactPhone: String(
        this.appraiserTableForm.value.appraiserRows[i].contactPhone
      ),
      vehicleCondition:
        this.appraiserTableForm.value.appraiserRows[i].vehicleCondition,
      modifiedBy: this.loginUserDetails.username,
    };
    this.httpService.updateAppraiser(request).subscribe((res) => {
      if (res) {
        Swal.fire({
          icon: 'success',
          text: 'Appraiser details updated successfully!',
        });
        (this.appraiserTableForm as any).get('appraiserRows')?.at(i).get('isEditable').patchValue(true);
        this.getAllAppraiser();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Appraiser details updated failed!',
        });
      }
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please add all mandatory fields!',
    });
  }
  }

  editTableInput(appraiserTableForm: any, i: any) {
    let allRowsControls = appraiserTableForm.get('appraiserRows')['controls'];
    allRowsControls.map((element: any,index:any) =>
      element.patchValue({
        id: this.allAppraiserDetails[index].appraiser.id,
        tonTowReport: this.allAppraiserDetails[index].jobNum,
        appraiserName: this.allAppraiserDetails[index].appraiser.appraiserName,
        appraisedDate: this.allAppraiserDetails[index].appraiser.appraisedDate,
        companyName: this.allAppraiserDetails[index].appraiser.companyName,
        claim: this.allAppraiserDetails[index].appraiser.claim,
        contactAddress: this.allAppraiserDetails[index].appraiser.contactAddress,
        contactPhone: this.allAppraiserDetails[index].appraiser.contactPhone,
        vehicleCondition: this.allAppraiserDetails[index].appraiser.vehicleCondition,
        isEditable: true,
      })
    );
    this.selectedAppraiser = appraiserTableForm.value.appraiserRows[i];
    appraiserTableForm
      .get('appraiserRows')
      ?.at(i)
      .get('isEditable')
      .patchValue(false);
  }

  SaveVO(appraiserTableForm: any, i: number) {
    this.updateAppraiser(i);
    this.selectedAppraiser = null;
  }

  CancelSVO(appraiserTableForm: any, i: any) {
    appraiserTableForm
      .get('appraiserRows')
      ?.at(i)
      .get('isEditable')
      .patchValue(true);
    this.getAllAppraiser();
    this.selectedAppraiser = null;
    this.appraiserForm.controls['tonTowReport'].enable();
  }

  getIsEditable(i: number) {
    return this.appraiserTableForm.get('appraiserRows')?.value[i].isEditable;
  }

  getOptionText(option: any) {
    return option?.jobNum;
  }

  private _filter(value: any): string[] {
    if (typeof value !== 'object' && value) {
      const filterValue = value;
      return this.tonTowReportDropdownDetails.filter((option: any) =>
        option.jobNum.toLowerCase().includes(filterValue)
      );
    } else {
      return this.tonTowReportDropdownDetails;
    }
  }

  getDuplicateAppraiser(event: any) {
    this.httpService
      .getDuplicateAppraiser(this.appraiserForm.value.tonTowReport.tonTowRptId)
      .subscribe((res) => {
        this.duplicateAppraiserDetails = res;
        if (this.duplicateAppraiserDetails.length !== 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This JobId already exists. Please enter a new id. The entered job id can be edited from View Police report.',
          });
          this.appraiserForm.controls['tonTowReport'].setErrors({
            incorrect: true,
          });
        }
      });
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getDuplicateAdjuster(event: any) {
    this.httpService
      .getDuplicateAdjuster(this.appraiserForm.value.tonTowReport.tonTowRptId)
      .subscribe((res) => {
        this.checkAdjusterRecords = res;
        if (this.checkAdjusterRecords.length !== 0) {
          this.getDuplicateAppraiser(event);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            //text: 'Duplicate Adjuster details found for selected Job ID, Please select another one!',
            text: 'Please create Adjuster details and then create Appraiser',
          });
        }
      });
  }

  formatDate(e: any) {
    let d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    let convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    this.appraiserForm
      .get('appraisedDate')
      ?.setValue(convertDate, { onlyself: true });
  }

  formatDateInTable(e: any, i: number) {
    let d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    let convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    let selectedformGroup = (
      this.appraiserTableForm.get('appraiserRows') as FormArray
    ).controls[i] as FormGroup;
    selectedformGroup.controls['appraisedDate'].setValue(convertDate, {
      onlyself: true,
    });
  }

  onClickOfTonTowReport() {
    if (this.selectedAppraiser) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please cancel the edited row to proceed.',
      });
      this.appraiserForm.controls['tonTowReport'].disable();
    }
  }

  preventPaste(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  clearAppraiserDate() {
    this.appraiserForm.patchValue({
      appraisedDate: '',
    });
  }
}
