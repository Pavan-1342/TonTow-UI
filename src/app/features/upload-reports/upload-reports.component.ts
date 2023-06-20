import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { Observable, elementAt } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-reports',
  templateUrl: './upload-reports.component.html',
  styleUrls: ['./upload-reports.component.scss'],
})
export class UploadReportsComponent implements OnInit {
  uploadReportForm!: FormGroup;
  uploadReports = [
    { name: 'Police Report', value: 'PoliceReport' },
    { name: 'Vehicle Photos', value: 'VehiclePhotos' },
    { name: 'Cheques', value: 'Cheques' },
    { name: 'Crash Diagram', value: 'CrashDiagram' },
  ];
  fileInfo: any;
  localUrl: any;
  @Input() tonTowReportDropdownDetails: any;
  filteredOptions!: Observable<any[]>;
  loginUserDetails: any;
  tonTowReportId: any;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.tonTowReportId = this.loginUserDetails?.tonTowRptId;
    this.uploadReportForm = this.fb.group({
      tonTowreport: ['',[Validators.required]],
      uploadReports: ['',[Validators.required]],
      display: ['',[Validators.required]],
    });
    // if (this.loginUserDetails?.role === 'A') {
      this.filteredOptions = this.tonTowReportDropdownDetails;
      this.filteredOptions = this.uploadReportForm.controls[
        'tonTowreport'
      ].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    // }
  }

  isFileAllowed(fileName: string) {
    let isFileAllowed = false;
    const allowedFiles = ['.pdf', '.jpg', '.jpeg', '.png'];
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
      for (const ext of allowedFiles) {
        if (ext === extension[0].toLocaleLowerCase()) {
          isFileAllowed = true;
        }
      }
    }
    return isFileAllowed;
  }

  isFileSizeAllowed(size: any) {
    let isFileSizeAllowed = false;
    if (size < 4000000) {
      isFileSizeAllowed = true;
    }
    return isFileSizeAllowed;
  }

  onFileSelect(event: any) {
    const fileExt = this.isFileAllowed(event.target.files[0].name);
    const fileSize = this.isFileSizeAllowed(event.target.files[0].size);
    if (fileExt && fileSize) {
      const file: File = event.target.files[0];
      this.fileInfo = file;
      this.uploadReportForm.patchValue({
        display: file.name,
      });
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.localUrl = file.webkitRelativePath;
        };
        reader.readAsText(file);
      }
    } else {
      if (fileExt === false)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please Upload valid file format PNG, JPEG, JPG, PDF',
        });
      if (fileSize === false)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please Upload file size less than 4 MB',
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

  //return Job name from list
  getJobName(tonTowRptId: any) {
    return this.tonTowReportDropdownDetails?.find(
      (element: any) => element.tonTowRptId === tonTowRptId
    )?.jobNum;
  }

  uploadTonTowReports() {
    if(this.uploadReportForm.valid){
    this.httpService
      .uploadTonTowReports(
        this.uploadReportForm.value.tonTowreport.tonTowRptId,
        this.uploadReportForm.value.tonTowreport.jobNum,
        this.loginUserDetails.username,
        this.uploadReportForm.value.uploadReports,
        this.fileInfo
      )
      .subscribe((res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            text: 'Report uploaded succcessfully!',
          });
          this.uploadReportForm.reset();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Report uploaded failed!',
          });
        }
      });
    }
  }

  preventPaste(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
}
