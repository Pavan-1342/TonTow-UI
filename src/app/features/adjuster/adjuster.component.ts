import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpService } from 'src/app/services/http.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable, elementAt } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adjuster',
  templateUrl: './adjuster.component.html',
  styleUrls: ['./adjuster.component.scss'],
})
export class AdjusterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('f') myNgForm: any;
  displayedColumns: string[] = [
    'tonTowRptId',
    'adjusterName',
    'adjusterDate',
    'companyName',
    'claim',
    'contactAddress',
    'contactPhone',
    'edit',
  ];
  table: any;
  //showCreateAdjusterForm: boolean = false;
  adjusterForm!: FormGroup;
  dataSource = new MatTableDataSource<any>();
  userAdjusterDetails: any = [];
  loginUserDetails: any;
  tonTowReportId: any;
  adjusterTableForm!: FormGroup;
  isEditable: boolean = true;
  @Input() tonTowReportDropdownDetails: any;
  filteredOptions!: Observable<any[]>;
  duplicateAdjusterDetails: any;
  initialDataSource: any;
  initialTableData: any;
  initialTableDataArray: any;
  selectedAdjuster: any;
  checkFileClaimRecord: any;
  allAdjusterDetails: any;

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    //this.adjusterTableForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.tonTowReportId = this.loginUserDetails?.tonTowRptId;
    this.adjusterForm = this.fb.group({
      tonTowReport: ['', [Validators.required]],
      adjusterName: ['', [Validators.required, Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      appraisedDate: ['', Validators.required],
      companyName: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      claim: ['', [Validators.required, Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      contactAddress: ['', [Validators.required, Validators.maxLength(150),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      contactPhone: ['', [Validators.required, Validators.maxLength(15),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
    });
    this.adjusterTableForm = this.fb.group({
      adjusterRows: this.fb.array([]),
    });
    this.getAllAdjuster();
    if (this.loginUserDetails?.role === 'A') {
      this.filteredOptions = this.tonTowReportDropdownDetails;
      this.filteredOptions = this.adjusterForm.controls[
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
    this.adjusterTableForm = this.fb.group({
      adjusterRows: this.fb.array(
        resultArray.map((obj: any) =>
          this.fb.group({
            id: new FormControl(obj.id),
            tonTowReport: new FormControl(obj.tonTowReport),
            adjusterName: new FormControl(obj.adjusterName,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            appraisedDate: new FormControl(obj.appraisedDate,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            companyName: new FormControl(obj.companyName,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            claim: new FormControl(obj.claim,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            contactAddress: new FormControl(obj.contactAddress,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            contactPhone: new FormControl(obj.contactPhone,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            isEditable: new FormControl(obj.isEditable),
          })
        )
      ),
    });

    this.dataSource = new MatTableDataSource(
      (this.adjusterTableForm.get('adjusterRows') as FormArray).controls
    );
    this.dataSource.paginator = this.paginator;
  }

  // addReport() {
  //   this.showCreateAdjusterForm = true;
  // }

  getAllAdjuster() {
    this.httpService.getAllAdjuster().subscribe((res) => {
      this.allAdjusterDetails = res;
      this.adjusterTableForm = this.fb.group({
        adjusterRows: this.fb.array(
          res?.map((val: any) =>
            this.fb.group({
              id: new FormControl(val.adjuster.id),
              tonTowReport: new FormControl(val.jobNum),
              adjusterName: new FormControl(val.adjuster.adjusterName,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              appraisedDate: new FormControl(val.adjuster.appraisedDate,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              companyName: new FormControl(val.adjuster.companyName,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              claim: new FormControl(val.adjuster.claim,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              contactAddress: new FormControl(val.adjuster.contactAddress,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              contactPhone: new FormControl(val.adjuster.contactPhone,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              isEditable: new FormControl(true),
            })
          )
        ),
      });
      this.initialTableDataArray = this.adjusterTableForm.value.adjusterRows;
      this.initialDataSource = new MatTableDataSource(
        (this.adjusterTableForm.get('adjusterRows') as FormArray).controls
      );
      this.dataSource = new MatTableDataSource(
        (this.adjusterTableForm.get('adjusterRows') as FormArray).controls
      );
      this.dataSource.paginator = this.paginator;
    });
  }

  addAdjuster() {
    this.adjusterForm.markAllAsTouched();
    if (this.adjusterForm.valid) {
      let request = {
        tonTowRptId: this.adjusterForm.value.tonTowReport.tonTowRptId,
        adjusterName: this.adjusterForm.value.adjusterName,
        appraisedDate: this.adjusterForm.value.appraisedDate,
        companyName: this.adjusterForm.value.companyName,
        claim: String(this.adjusterForm.value.claim),
        contactAddress: this.adjusterForm.value.contactAddress,
        contactPhone: String(this.adjusterForm.value.contactPhone),
        createdBy: this.loginUserDetails.username,
      };
      this.httpService.addAdjuster(request).subscribe(
        (res) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              text: 'Adjuster details added  succcessfully!',
            });
            this.getAllAdjuster();
            this.myNgForm.resetForm();
            // Object.keys(this.adjusterForm.controls).forEach((key) => {
            //   this.adjusterForm.controls[key].setErrors(null);
            // });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Adjuster details failed to add!',
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

  deleteAdjuster(i: number) {
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
          id: this.adjusterTableForm.value.adjusterRows[i].id,
          modifiedBy: this.loginUserDetails.username,
        };
        this.httpService.deleteAdjuster(request).subscribe(
          (res) => {
            if (res) {
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
              this.getAllAdjuster();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Adjuster details delete failed! ',
              });
            }
          },
          (error) => {}
        );
      }
    });
  }

  getUserAdjuster() {
    this.httpService
      .getUserAdjuster(this.adjusterForm.value.tonTowReport)
      .subscribe(
        (res) => {
          this.userAdjusterDetails = res;
        },
        (error) => {
          this.snackBar.open(error.error, 'close', {
            ////duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      );
  }

  editTableInput(adjusterTableForm: any, i: any) {
    let allRowsControls = adjusterTableForm.get('adjusterRows')['controls'];
    allRowsControls.map((element: any, index: any) =>
      element.patchValue({
        id: this.allAdjusterDetails[index].adjuster.id,
        tonTowReport: this.allAdjusterDetails[index].jobNum,
        adjusterName: this.allAdjusterDetails[index].adjuster.adjusterName,
        appraisedDate: this.allAdjusterDetails[index].adjuster.appraisedDate,
        companyName: this.allAdjusterDetails[index].adjuster.companyName,
        claim: this.allAdjusterDetails[index].adjuster.claim,
        contactAddress: this.allAdjusterDetails[index].adjuster.contactAddress,
        contactPhone: this.allAdjusterDetails[index].adjuster.contactPhone,
        isEditable: true,
      })
    );
    this.selectedAdjuster = adjusterTableForm.value.adjusterRows[i];
    adjusterTableForm
      .get('adjusterRows')
      ?.at(i)
      .get('isEditable')
      .patchValue(false);
  }

  SaveVO(adjusterTableForm: any, i: number) {
    this.updateAdjuster(i);
    this.selectedAdjuster = null;
  }

  CancelSVO(adjusterTableForm: any, i: any) {
    adjusterTableForm
      .get('adjusterRows')
      ?.at(i)
      .get('isEditable')
      .patchValue(true);
    this.getAllAdjuster();
    this.selectedAdjuster = null;
    this.adjusterForm.controls['tonTowReport'].enable();
  }

  getIsEditable(i: number) {
    return this.adjusterTableForm.get('adjusterRows')?.value[i].isEditable;
  }

  updateAdjuster(i: number) {
    this.adjusterTableForm.markAllAsTouched();
    let allRowsControls = (this.adjusterTableForm.get('adjusterRows') as FormArray).controls
    if (allRowsControls[i].valid) {
    let request = {
      id: this.adjusterTableForm.value.adjusterRows[i].id,
      adjusterName: this.adjusterTableForm.value.adjusterRows[i].adjusterName,
      appraisedDate: this.adjusterTableForm.value.adjusterRows[i].appraisedDate,
      companyName: this.adjusterTableForm.value.adjusterRows[i].companyName,
      claim: String(this.adjusterTableForm.value.adjusterRows[i].claim),
      contactAddress:
        this.adjusterTableForm.value.adjusterRows[i].contactAddress,
      contactPhone: String(
        this.adjusterTableForm.value.adjusterRows[i].contactPhone
      ),
      modifiedBy: this.loginUserDetails.username,
    };
    this.httpService.updateAdjuster(request).subscribe((res) => {
      if (res) {
        Swal.fire({
          icon: 'success',
          text: 'Adjuster details updated successfully!',
        });
        (this.adjusterTableForm as any).get('adjusterRows')?.at(i).get('isEditable').patchValue(true);
        this.getAllAdjuster();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Adjuster details updated failed!',
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

  getDuplicateAdjuster(event: any) {
    this.httpService
      .getDuplicateAdjuster(this.adjusterForm.value.tonTowReport.tonTowRptId)
      .subscribe((res) => {
        this.duplicateAdjusterDetails = res;
        if (this.duplicateAdjusterDetails.length !== 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            //text: 'Duplicate Adjuster details found for selected Job ID, Please select another one!',
            text: 'This Job Id already exists. Please click on the edit button to modify or select another Job Id.',
          });

          this.adjusterForm.controls['tonTowReport'].setErrors({
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

  highlight(element: any) {
    element.highlighted = !element.highlighted;
  }

  getDuplicateFileClaim(event: any) {
    this.httpService
      .getDuplicateFileClaim(this.adjusterForm.value.tonTowReport.tonTowRptId)
      .subscribe((res) => {
        this.checkFileClaimRecord = res;
        if (this.checkFileClaimRecord.length !== 0) {
          this.getDuplicateAdjuster(event);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            //text: 'Duplicate Adjuster details found for selected Job ID, Please select another one!',
            text: 'Please create File Claim details and then create Adjuster',
          });
        }
      });
  }

  formatDate(e: any) {
    var d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    var convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    this.adjusterForm
      .get('appraisedDate')
      ?.setValue(convertDate, { onlyself: true });
  }

  formatDateInTable(e: any, i: number) {
    var d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    var convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    let selectedformGroup = (
      this.adjusterTableForm.get('adjusterRows') as FormArray
    ).controls[i] as FormGroup;
    selectedformGroup
      .get('appraisedDate')
      ?.setValue(convertDate, { onlyself: true });
  }

  onClickOfTonTowReport() {
    if (this.selectedAdjuster) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please cancel the edited row to proceed.',
      });
      this.adjusterForm.controls['tonTowReport'].disable();
    }
  }

  preventPaste(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  clearAppraiserDate() {
    this.adjusterForm.patchValue({
      appraisedDate: '',
    });
  }

  
}
