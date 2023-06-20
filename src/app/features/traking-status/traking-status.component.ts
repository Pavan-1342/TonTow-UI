import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { Observable, elementAt } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
@Component({
  selector: 'app-traking-status',
  templateUrl: './traking-status.component.html',
  styleUrls: ['./traking-status.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class TrakingStatusComponent implements OnInit {
  @Input() tonTowReportDropdownDetails: any;
  trackingStatusForm!: FormGroup;
  filteredOptions!: Observable<any[]>;
  getTonTowPoliceReportDetails: any;
  loginUserDetails: any;
  constructor(
    private dialog: MatDialog,
    private httpService: HttpService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.trackingStatusForm = this.fb.group({
      tonTowReport: [''],
    });
    if (this.loginUserDetails?.role === 'A') {
      this.filteredOptions =  this.tonTowReportDropdownDetails ;
      this.filteredOptions = this.trackingStatusForm.controls[
        'tonTowReport'
      ].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    } else {
      this.getTonTowPoliceReportStatus();
    }
  }

  // getTonTowPoliceReportDropDown() {
  //   this.httpService.getTonTowPoliceReportDropDown().subscribe((res) => {
  //     this.tonTowReportDropdownDetails = res;
     
  //     this.trackingStatusForm.controls['tonTowReport'].valueChanges.subscribe;
  //   });
  // }

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

  getAutoCompleteOptionText(option: any) {
    return option?.jobNum;
  }

  getTonTowPoliceReportStatus() {
    this.httpService
      .getTonTowPoliceReportStatus(
        this.loginUserDetails?.role === 'A'
          ? this.trackingStatusForm.value.tonTowReport.tonTowRptId
          : this.loginUserDetails.tonTowRptId
      )
      .subscribe((res) => {
        this.getTonTowPoliceReportDetails = res[0];
      });
  }

  openFileClaimDialog() {
    this.dialog.open(FileClaimDialog, {
      data: this.getTonTowPoliceReportDetails,
    });
  }

  openAdjusterDialog() {
    this.dialog.open(AdjusterDialog, {
      data: this.getTonTowPoliceReportDetails,
    });
  }

  openAppraiserDialog() {
    this.dialog.open(AppraiserDialog, {
      data: this.getTonTowPoliceReportDetails,
    });
  }

  openInsuranceDialog() {
    this.dialog.open(InsuranceDialog, {
      data: this.getTonTowPoliceReportDetails,
    });
  }

  openPaymentDialog() {
    this.dialog.open(PaymentDialog, {
      data: this.getTonTowPoliceReportDetails,
    });
  }

  preventPaste(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
}

@Component({
  selector: 'file-claim-dialog',
  templateUrl: 'file-claim-dialog.html',
  styleUrls: ['./traking-status.component.scss'],
})
export class FileClaimDialog {
  fileClaimReportForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<FileClaimDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.fileClaimReportForm = this.fb.group({
      fileClaim: [data.fileClaimNumber],
    });
    this.fileClaimReportForm.disable();
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

@Component({
  selector: 'adjuster-dialog',
  templateUrl: 'adjuster-dialog.html',
  styleUrls: ['./traking-status.component.scss'],
})
export class AdjusterDialog {
  adjusterForm!: FormGroup;
  showCreateAdjusterForm: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AdjusterDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.adjusterForm = this.fb.group({
      adjusterName: [data.adjName],
      appraisedDate: [data.adjAppraisedDate],
      companyName: [data.adjCompanyName],
      claim: [data.adjClaim],
      contactAddress: [data.adjContactAddress],
      contactPhone: [data.adjContactPhone],
    });
    this.adjusterForm.disable();
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

@Component({
  selector: 'appraiser-dialog',
  templateUrl: 'appraiser-dialog.html',
  styleUrls: ['./traking-status.component.scss'],
})
export class AppraiserDialog {
  appraiserForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AppraiserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.appraiserForm = this.fb.group({
      appraiserName: [data.appName],
      appraisedDate: [data.appAppraisedDate],
      companyName: [data.appCompanyName],
      claim: [data.appClaim],
      contactAddress: [data.appContactAddress],
      contactPhone: [data.appContactPhone],
      vehicleCondition: [data.appVehCondition],
    });
    this.appraiserForm.disable();
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

@Component({
  selector: 'insurance-dialog',
  templateUrl: 'insurance-dialog.html',
  styleUrls: ['./traking-status.component.scss'],
})
export class InsuranceDialog {
  customerContactForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<InsuranceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.customerContactForm = this.fb.group({
      repairableNotes_1: [data.ciRepairableNotes1],
      repairableNotes_2: [data.ciRepairableNotes2],
      vehicleCondition: [data.ciVehCondition],
      totaledNotes: [data.ciTotaledNotes],
    });
    this.customerContactForm.disable();
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

@Component({
  selector: 'payment-dialog',
  templateUrl: 'payment-dialog.html',
  styleUrls: ['./traking-status.component.scss'],
})
export class PaymentDialog {
  customerDetailsForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<PaymentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.customerDetailsForm = this.fb.group({
      PaymentMethodType: [data.cpPaymentType],
      fullPaymentDate: [data.cpFullPaymentDate],
      fullPaymentAmount: [data.cpFullPaymentAmt],
      fullPaymentType: [data.cpFullPaymentType],
      fullPaymentCardDetails: [data.cpFullPaymentCardDtls],
      fullPaymentInvoice: [data.cpFullPaymentInvNum],
      partialPayment_1Amount: [data.cpPartialPayment1Amt],
      partialPayment_1Date: [data.cpPartialPayment1Date],
      partialPayment_1Type: [data.cpPartialPayment1Type],
      partialPayment_1CardDetails: [data.cpPartialPayment1CardDtls],
      partialPayment_1Invoice: [data.cpPartialPayment1InvNum],
      partialPayment_2Amount: [data.cpPartialPayment2Amt],
      partialPayment_2Date: [data.cpPartialPayment2Date],
      partialPayment_2Type: [data.cpPartialPayment2Type],
      partialPayment_2CardDetails: [data.cpPartialPayment2CardDtls],
      partialPayment_2Invoice: [data.cpPartialPayment2InvNum],
      partialPayment_3Amount: [data.cpPartialPayment3Amt],
      partialPayment_3Date: [data.cpPartialPayment3Date],
      partialPayment_3Type: [data.cpPartialPayment3Type],
      partialPayment_3CardDetails: [data.cpPartialPayment3CardDtls],
      partialPayment_3Invoice: [data.cpPartialPayment3InvNum],
      partialPayment_4Amount: [data.cpPartialPayment4Amt],
      partialPayment_4Date: [data.cpPartialPayment4Date],
      partialPayment_4Type: [data.cpPartialPayment4Type],
      partialPayment_4CardDetails: [data.cpPartialPayment4CardDtls],
      partialPayment_4Invoice: [data.cpPartialPayment4InvNum],
      partialPayment_5Amount: [data.cpPartialPayment5Amt],
      partialPayment_5Date: [data.cpPartialPayment5Date],
      partialPayment_5Type: [data.cpPartialPayment5Type],
      partialPayment_5CardDetails: [data.cpPartialPayment5CardDtls],
      partialPayment_5Invoice: [data.cpPartialPayment5InvNum],
      partialPayment_6Amount: [data.cpPartialPayment6Amt],
      partialPayment_6Date: [data.cpPartialPayment6Date],
      partialPayment_6Type: [data.cpPartialPayment6Type],
      partialPayment_6CardDetails: [data.cpPartialPayment6CardDtls],
      partialPayment_6Invoice: [data.cpPartialPayment6InvNum],
    });
    this.customerDetailsForm.disable();
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
