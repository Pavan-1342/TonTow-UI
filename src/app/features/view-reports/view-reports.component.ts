import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { Observable, elementAt } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.scss'],
})
export class ViewReportsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  viewReportsForm!: FormGroup;
  fileInfo: any;
  localUrl: any;
  @Input() tonTowReportDropdownDetails: any;
  filteredOptions!: Observable<any[]>;
  displayedColumns: string[] = ['jobNum', 'fileName', 'fileType', 'edit'];
  userFileDetails: any = [];
  dataSource = new MatTableDataSource();
  loginUserDetails: any;

  constructor(private fb: FormBuilder, private httpService: HttpService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.viewReportsForm = this.fb.group({
      tonTowReport: [''],
    });
    if (this.loginUserDetails?.role === 'A') {
      this.filteredOptions = this.tonTowReportDropdownDetails;
      this.filteredOptions = this.viewReportsForm.controls[
        'tonTowReport'
      ].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    } else {
      this.getUserFiles();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onFileSelect(event: any) {
    const file: File = event.target.files[0];
    this.fileInfo = `${file.name}`;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = file.webkitRelativePath;
      };
      reader.readAsText(file);
    }
  }

  // getTonTowPoliceReportDropDown() {
  //   this.httpService.getTonTowPoliceReportDropDown().subscribe((res) => {
  //     this.tonTowReportDropdownDetails = res;

  //   });
  // }

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

  getUserFiles() {
        this.userFileDetails = [];
    this.httpService.getUserFiles(this.loginUserDetails?.role === 'A'? this.viewReportsForm.value.tonTowReport.tonTowRptId: this.loginUserDetails.tonTowRptId).subscribe((res) => {
      let data:any =[];
      res.forEach((Object:any)=>{
        data.push({
          "jobNum":Object.jobNum,
          "fileName":Object.tonTowFileUpload.fileName,
          "fileType":Object.tonTowFileUpload.fileType,
          "tonTowFileUpload":Object.tonTowFileUpload
        })
      })
              this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
  }

  // showReport(report: any) {
  //   const requestBody = [
  //     {
  //       key: '@TonTowRptId',
  //       value: this.viewReportsForm.value.tonTowReport.tonTowRptId,
  //     },
  //   ];
  //   let reportName = report.tonTowFileUpload.fileType === "TonTowReport-Entire"?"policeReport":"PoliceReport_Mandatory"
  //   this.httpService
  //     .downloadReport(reportName, report.tonTowFileUpload.fileName, requestBody)
  //     .subscribe((response: Blob) => {
  //       const blobUrl = window.URL.createObjectURL(response);
  //       window.open(blobUrl, '_blank');
  //     });
  // }

  showReport(report: any) {
    const requestBody = [
      {
        key: '@TonTowRptId',
        value: this.viewReportsForm.value.tonTowReport.tonTowRptId,
      },
    ];

    if (
      report.tonTowFileUpload.fileType == 'TonTowReport-Entire' ||
      report.tonTowFileUpload.fileType == 'TonTowReport-Mandatory'
    ) {
      let reportName =
        report.tonTowFileUpload.fileType === 'TonTowReport-Entire'
          ? 'policeReport'
          : 'PoliceReport_Mandatory';
      this.httpService
        .downloadReport(
          reportName,
          report.tonTowFileUpload.fileName,
          requestBody
        )
        .subscribe((response: Blob) => {
          // const blobUrl = URL.createObjectURL(response);
         // window.open(blobUrl, '_blank');
         const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(response);
        downloadLink.download = report.fileType;
        downloadLink.click();
         
        });
    } else {
      this.downloadTonTowFiles(report.jobNum, report.tonTowFileUpload.fileName);
    }
  }

  downloadTonTowFiles(jobNum: any, fileName: any) {
    this.httpService
      .downloadTonTowFiles(jobNum, fileName)
      .subscribe((blob: any) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  preventPaste(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  
}
