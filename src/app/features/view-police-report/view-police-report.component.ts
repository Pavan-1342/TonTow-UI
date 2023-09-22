import { Component, EventEmitter, OnInit, ViewChild, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-view-police-report',
  templateUrl: './view-police-report.component.html',
  styleUrls: ['./view-police-report.component.scss'],
})
export class ViewPoliceReportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() editButtonClicked: EventEmitter<number> = new EventEmitter<number>();
  displayedColumns: string[] = ['jobNum','tonTowRptId','email', 'createdDate','phone','edit'];
  dataSource = new MatTableDataSource<any>();
  policeReportForm_1: any;
  policeReportForm_2: any;
  loginUserDetails: any;
  allPoliceReportDetails: never[];
  
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getAllPoliceReport();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
      }

  getAllPoliceReport() {
    this.httpService.getAllPoliceReport().subscribe((res) => {
      let data:any =[];
      res.forEach((Object:any)=>{
        data.push({
          "jobNum":Object.policereport.jobNum,
          "tonTowRptId": Object.policereport.tonTowRptId,
          "createdDate" : Object.policereport.createdDate,
          "email":Object.email,
          "phone" : Object.phone,
          "policereport": Object.policereport,

        })
      });
      this.dataSource = new MatTableDataSource(data.reverse());
      this.dataSource.paginator = this.paginator;
          });
  }

  onEdit(record: any) {
    this.editButtonClicked.emit(record.policereport.tonTowRptId)
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // getPoliceReportEmailPhone(){
  //   this.httpService.getPoliceReportEmailPhone(thispolicereport.tonTowRptId).
  // }

  
  
}
