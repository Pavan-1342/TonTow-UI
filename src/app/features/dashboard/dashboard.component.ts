import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { HttpService } from 'src/app/services/http.service';
import { PoliceReportComponent } from '../police-report/police-report.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loginUserDetails: any;
  tonTowReportDropdownDetails: any;
  public demo1TabIndex: FormControl = new FormControl(0);
  viewReportID: number|undefined;
  allowToNextTab: string;
  @ViewChild(PoliceReportComponent)
  policeReportComponent: PoliceReportComponent;
  indexOld = 0;
  index = 0;
  matTabIntance: any;
  matIndex: number;
  constructor(private httpService: HttpService,private changeDetectorRef:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    if (this.loginUserDetails?.role === 'A') {
      this.getTonTowPoliceReportDropDown();
    }
  }
  getTonTowPoliceReportDropDown() {
    this.httpService.getTonTowPoliceReportDropDown().subscribe((res) => {
      this.tonTowReportDropdownDetails = res;
    });
  }
  openPoliceReportTab(event: any) {
    // this.demo1TabIndex.setValue(0);
    this.matTabIntance.selectedIndex = 0
    this.viewReportID = event;
    this.changeDetectorRef.detectChanges();
    setTimeout(()=>{
      this.viewReportID= undefined
    },500)
  }

  checkPoliceReportValidation(tab: any, index: any) {
    if (tab.selectedIndex !== 0 && !this.allowToNextTab && this.loginUserDetails?.role === 'A') {
      this.matTabIntance = tab;
      this.matIndex = index;
      tab.selectedIndex = this.indexOld;
      this.policeReportComponent.showClearConfirmation(tab);
    }
    setTimeout(() => {
      if (index === 0) {
        this.allowToNextTab = '';
      }
    }, 1000);
  }

  changeAllowNextTab(val: string) {
    this.allowToNextTab = val;
    if (val) {
      this.matTabIntance.selectedIndex = this.matIndex;
    } else {
      this.matTabIntance.selectedIndex = this.indexOld;
    }
  }
}
