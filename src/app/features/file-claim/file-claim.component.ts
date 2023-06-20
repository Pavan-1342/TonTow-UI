import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable, elementAt } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-file-claim',
  templateUrl: './file-claim.component.html',
  styleUrls: ['./file-claim.component.scss'],
})
export class FileClaimComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('f') myNgForm: any;
  fileClaimReportForm!: FormGroup;
  displayedColumns: string[] = ['tonTowRptId', 'fileClaimNumber', 'edit'];
  table: any;
  //showCreateFileClaimForm: boolean = false;
  addFileClaimDetails: any;
  tonTowReportId: any;
  loginUserDetails: any;
  dataSource = new MatTableDataSource<any>();
  modifiedUser: any;
  fileClaimTableForm!: FormGroup;
  isEditable: boolean = true;
  @Input() tonTowReportDropdownDetails: any = [];
  filteredOptions!: Observable<any[]>;
  duplicateFileClaimDetails: any;
  initialDataSource: any;
  initialTableDataArray: any;
  selectedFileCliam: any;
  selectedRowIndex = -1;
  allFileclaimDetails: any;

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.fileClaimReportForm = this.fb.group({
      tonTowReport: ['', [Validators.required]],
      fileClaim: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
    });
    this.fileClaimTableForm = this.fb.group({
      fileClaimRows: this.fb.array([]),
    });
    this.getAllFileClaims();
    if (this.loginUserDetails?.role === 'A') {
      this.filteredOptions = this.tonTowReportDropdownDetails;
      this.filteredOptions = this.fileClaimReportForm.controls[
        'tonTowReport'
      ].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    }
    this.dataSource = new MatTableDataSource(
      (this.fileClaimTableForm.get('fileClaimRows') as FormArray).controls
    );
    this.dataSource.paginator = this.paginator;
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
    this.fileClaimTableForm = this.fb.group({
      fileClaimRows: this.fb.array(
        resultArray?.map((obj: any) =>
          this.fb.group({
            id: new FormControl(obj.id),
            tonTowReport: new FormControl(obj.tonTowReport),
            fileClaimNumber: new FormControl(obj.fileClaimNumber,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
            isEditable: new FormControl(obj.isEditable),
          })
        )
      ),
    });

    this.dataSource = new MatTableDataSource(
      (this.fileClaimTableForm.get('fileClaimRows') as FormArray).controls
    );
    this.dataSource.paginator = this.paginator;
  }

  getAllFileClaims() {
    this.httpService.getAllFileClaims().subscribe((res) => {
      this.allFileclaimDetails = res;
      this.fileClaimTableForm = this.fb.group({
        fileClaimRows: this.fb.array(
          res?.map((val: any) =>
            this.fb.group({
              id: new FormControl(val.fileClaims.id),
              tonTowReport: new FormControl(val.jobNum),
              fileClaimNumber: new FormControl(val.fileClaims.fileClaimNumber,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
              isEditable: new FormControl(true),
            })
          )
        ),
      });
      this.initialTableDataArray = this.fileClaimTableForm.value.fileClaimRows;
      this.initialDataSource = new MatTableDataSource(
        (this.fileClaimTableForm.get('fileClaimRows') as FormArray).controls
      );
      this.dataSource = new MatTableDataSource(
        (this.fileClaimTableForm.get('fileClaimRows') as FormArray).controls
      );
      this.dataSource.paginator = this.paginator;
    });
  }

  addfileclaim() {
    this.fileClaimReportForm.markAllAsTouched();
    if (this.fileClaimReportForm.valid) {
      let request = {
        tonTowRptId: this.fileClaimReportForm.value.tonTowReport.tonTowRptId,
        fileClaimNumber: this.fileClaimReportForm.value.fileClaim,
        createdBy: this.loginUserDetails.username,
      };
      this.httpService.addfileclaim(request).subscribe(
        (res) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              text: 'FIle Claim details added  succcessfully!',
            });
            this.getAllFileClaims();
            this.myNgForm.resetForm();
          //   Object.keys(this.fileClaimReportForm.controls).forEach(key =>{
          //     this.fileClaimReportForm.controls[key].setErrors(null)
          //  });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'File Claim details failed to add!',
            });
            // this.snackBar.open('File Claim details failed to add ', 'close', {
            //         //duration: 2000,
            //         horizontalPosition: 'end',
            //         verticalPosition: 'top',
            //       });
          }
        },
        (error) => {}
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please add all mandatory fields!',
      });
    }
  }

  deleteFileClaim(i: number) {
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
          Id: this.fileClaimTableForm.value.fileClaimRows[i].id,
          ModifiedBy: this.loginUserDetails.username,
        };
        this.httpService
          .deletefileclaim(
            this.fileClaimTableForm.value.fileClaimRows[i].id,
            this.loginUserDetails.username,
            request
          )
          .subscribe(
            (res) => {
              if (res) {
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                this.snackBar.open('File claim details deleted', 'close', {
                  //duration: 2000,
                  horizontalPosition: 'end',
                  verticalPosition: 'top',
                });
                this.getAllFileClaims();
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'File claims details not deleted!',
                });
              }
            },
            (error) => {}
          );
      }
    });
  }

  editTableInput(fileClaimTableForm: any, i: any) {
    let allRowsControls = fileClaimTableForm.get('fileClaimRows')['controls'];
    allRowsControls.map((element: FormGroup, index: number) =>
      element.patchValue({
        id: this.allFileclaimDetails[index].fileClaims.id,
        tonTowReport: this.allFileclaimDetails[index].jobNum,
        fileClaimNumber:
          this.allFileclaimDetails[index].fileClaims.fileClaimNumber,
        isEditable: true,
      })
    );
    this.selectedFileCliam = fileClaimTableForm.value.fileClaimRows[i];
    fileClaimTableForm
      .get('fileClaimRows')
      ?.at(i)
      .get('isEditable')
      .patchValue(false);
  }

  SaveVO(fileClaimTableForm: any, i: number) {
    this.updatefileclaim(i);
    this.selectedFileCliam = null;
  }

  CancelSVO(fileClaimTableForm: any, i: any) {
    fileClaimTableForm
      .get('fileClaimRows')
      ?.at(i)
      .get('isEditable')
      .patchValue(true);
    this.getAllFileClaims();
    this.selectedFileCliam = null;
    this.fileClaimReportForm.controls['tonTowReport'].enable();
  }

  getIsEditable(i: number) {
    return this.fileClaimTableForm.get('fileClaimRows')?.value[i].isEditable;
  }

  updatefileclaim(i: number) {
    this.fileClaimTableForm.markAllAsTouched();
    let allRowsControls =  (this.fileClaimTableForm.get('fileClaimRows') as FormArray).controls
    if (allRowsControls[i].valid) {
    let request = {
      id: this.fileClaimTableForm.value.fileClaimRows[i].id,
      fileClaimNumber:
        this.fileClaimTableForm.value.fileClaimRows[i].fileClaimNumber,
      modifiedBy: this.loginUserDetails.username,
    };
    this.httpService.updatefileclaim(request).subscribe(
      (res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            text: 'FIle Claim details updated  succcessfully!',
          });
          (this.fileClaimTableForm as any).get('fileClaimRows')?.at(i).get('isEditable').patchValue(true);
          this.getAllFileClaims();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'File claim details updated failed!',
          });
        }
      },
      (error) => {}
    );
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please add all mandatory fields!',
    });
  }
  }

  getAutoCompleteOptionText(option: any) {
    return option?.jobNum;
  }

  private _filter(value: string): string[] {
    if (typeof value !== 'object' && value) {
      //const filterValue = JSON.stringify(value).toLowerCase();
      return this.tonTowReportDropdownDetails.filter((option: any) =>
        option.jobNum.toLowerCase().includes(value)
      );
    } else {
      return this.tonTowReportDropdownDetails;
    }
  }

  getDuplicateFileClaim(event: any) {
    this.httpService
      .getDuplicateFileClaim(
        this.fileClaimReportForm.value.tonTowReport.tonTowRptId
      )
      .subscribe((res) => {
        this.duplicateFileClaimDetails = res;
        if (this.duplicateFileClaimDetails.length !== 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This JobId already exists. Please enter a new id. The entered job id can be edited from View Police report.',
          });
          // this.snackBar.open('Duplicate File CLaim details found for selected Job ID, Please select another one', 'close', {
          //   ////duration: 3000,
          //   horizontalPosition: 'end',
          //   verticalPosition: 'top',
          // });
          this.fileClaimReportForm.controls['tonTowReport'].setErrors({
            incorrect: true,
          });
        }
      });
  }

  highlight(element: any) {
    element.highlighted = !element.highlighted;
  }

  onClickOfTonTowReport() {
    if (this.selectedFileCliam) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please cancel the edited row to proceed.',
      });
      this.fileClaimReportForm.controls['tonTowReport'].disable();
    }
  }

  preventPaste(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
}
