import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable, elementAt } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-payment-details',
  templateUrl: './customer-payment-details.component.html',
  styleUrls: ['./customer-payment-details.component.scss'],
})
export class CustomerPaymentDetailsComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('f') myNgForm: any;
  customerDetailsForm : FormGroup;
  //showCreateCustomerDetailsForm: boolean = false;
  displayedColumns: string[] = ['tonTowRptId', 'paymentType', 'edit'];
  dataSource = new MatTableDataSource<any>();
  getUserPaymentDetails: any = [];
  loginUserDetails: any;
  tonTowReportId: any;
  fullPayment: boolean = false;
  partialPayment: boolean = false;
  @Input() tonTowReportDropdownDetails: any;
  filteredOptions!: Observable<any[]>;
  duplicateCustomerPaymentDetails: any;
  customerPaymentTableForm!: FormGroup;
  showUpdateRecordButton: boolean = false;
  selectedCustomerPaymentJobNum: any;
  checkCustomerInsuranceRecords: any;
  initialDataSource: any;
  selectedRecordIndex: number;
  selectedRecord: any;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.tonTowReportId = this.loginUserDetails?.tonTowRptId;
    // this.customerDetailsForm = this.fb.group({
    //   tonTowReport: [''],
    //   PaymentMethodType :[''],
    //   fullPaymentGroup: this.fb.group({
    //     fullPaymentDate: [''],
    //     fullPaymentAmount: [''],
    //     fullPaymentType: ['', Validators.maxLength(50)],
    //     fullPaymentCardDetails: ['', Validators.maxLength(50)],
    //   }),
    //   partialPaymentArray: new FormArray([]),
    // });
    this.customerDetailsForm = this.fb.group({
      id: [''],
      tonTowReport: ['',[ Validators.required]],
      PaymentMethodType: [''],
      fullPaymentDate: [''],
      fullPaymentAmount: ['',[Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
      fullPaymentType: ['', [Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      fullPaymentCardDetails: ['', [Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      fullPaymentInvoice: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_1Amount: [''],
      partialPayment_1Date: [''],
      partialPayment_1Type: ['', [Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_1CardDetails: ['', [Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_1Invoice: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_2Amount: [''],
      partialPayment_2Date: [''],
      partialPayment_2Type: ['', [Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_2CardDetails: ['',[Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_2Invoice: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_3Amount: [''],
      partialPayment_3Date: [''],
      partialPayment_3Type: ['',[Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_3CardDetails: ['',[Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_3Invoice: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_4Amount: [''],
      partialPayment_4Date: [''],
      partialPayment_4Type: ['',[Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_4CardDetails: ['',[Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_4Invoice: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_5Amount: [''],
      partialPayment_5Date: [''],
      partialPayment_5Type: ['',[Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_5CardDetails: ['',[Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_5Invoice: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_6Amount: [''],
      partialPayment_6Date: [''],
      partialPayment_6Type: ['',[Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_6CardDetails: ['',[Validators.maxLength(50),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      partialPayment_6Invoice: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
    });
    this.customerPaymentTableForm = this.fb.group({
      paymentRows: this.fb.array([]),
    });
    //this.addPartialPayment()
    this.getAllCustomerPaymentDtls();
    if (this.loginUserDetails?.role === 'A') {
      this.filteredOptions = this.tonTowReportDropdownDetails;
      this.filteredOptions = this.customerDetailsForm.controls[
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllCustomerPaymentDtls() {
    this.httpService.getAllCustomerPaymentDtls().subscribe((res) => {
      let data: any = [];
      res.forEach((Object: any) => {
        data.push({
          jobNum: Object.jobNum,
          paymenttype: Object.customerPaymentDtls.paymentType,
          customerPaymentDtls: Object.customerPaymentDtls,
          isEdit: false,
        });
      });
      this.initialDataSource = data
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  getUserCustomerPaymentDtls(tonTowReportId: any) {
    let request = {
      TonTowRptId: this.customerDetailsForm.value.tonTowReport,
    };
    this.httpService
      .getUserCustomerPaymentDtls(tonTowReportId, request)
      .subscribe(
        (res) => {
          this.getUserPaymentDetails = res;
        },
        (error) => {
          this.snackBar.open(error.error, 'close', {
            //duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      );
  }

  addCustomerPaymentDtls() {
    this.clearInputFieldsBasedOnPaymentType(this.customerDetailsForm.value.PaymentMethodType)
    let request = {
      tonTowRptId: this.customerDetailsForm.value.tonTowReport.tonTowRptId,
      paymentType: this.customerDetailsForm.value.PaymentMethodType,
      fullPaymentAmt: this.customerDetailsForm.value.fullPaymentAmount
        ? this.customerDetailsForm.value.fullPaymentAmount
        : null,
      fullPaymentDate: this.customerDetailsForm.value.fullPaymentDate
        ? this.customerDetailsForm.value.fullPaymentDate
        : null,
      fullPaymentType: this.customerDetailsForm.value.fullPaymentType
        ? this.customerDetailsForm.value.fullPaymentType
        : null,
      fullPaymentCardDtls: this.customerDetailsForm.value.fullPaymentCardDetails
        ? this.customerDetailsForm.value.fullPaymentCardDetails
        : null,
      fullPaymentInvNum: this.customerDetailsForm.value.fullPaymentInvoice
        ? this.customerDetailsForm.value.fullPaymentInvoice
        : null,
      partialPayment1Amt: this.customerDetailsForm.value.partialPayment_1Amount
        ? this.customerDetailsForm.value.partialPayment_1Amount
        : null,
      partialPayment1Date: this.customerDetailsForm.value.partialPayment_1Date
        ? this.customerDetailsForm.value.partialPayment_1Date
        : null,
      partialPayment1Type: this.customerDetailsForm.value.partialPayment_1Type
        ? this.customerDetailsForm.value.partialPayment_1Type
        : null,
      paritalPayment1CardDtls: this.customerDetailsForm.value
        .partialPayment_1CardDetails
        ? this.customerDetailsForm.value.partialPayment_1CardDetails
        : null,
      paritalPayment1InvNum: this.customerDetailsForm.value
        .partialPayment_1Invoice
        ? this.customerDetailsForm.value.partialPayment_1Invoice
        : null,
      partialPayment2Amt: this.customerDetailsForm.value.partialPayment_2Amount
        ? this.customerDetailsForm.value.partialPayment_2Amount
        : null,
      partialPayment2Date: this.customerDetailsForm.value.partialPayment_2Date
        ? this.customerDetailsForm.value.partialPayment_2Date
        : null,
      partialPayment2Type: this.customerDetailsForm.value.partialPayment_2Type
        ? this.customerDetailsForm.value.partialPayment_2Type
        : null,
      paritalPayment2CardDtls: this.customerDetailsForm.value
        .partialPayment_2CardDetails
        ? this.customerDetailsForm.value.partialPayment_2CardDetails
        : null,
      paritalPayment2InvNum: this.customerDetailsForm.value
        .partialPayment_2Invoice
        ? this.customerDetailsForm.value.partialPayment_2Invoice
        : null,
      partialPayment3Amt: this.customerDetailsForm.value.partialPayment_3Amount
        ? this.customerDetailsForm.value.partialPayment_3Amount
        : null,
      partialPayment3Date: this.customerDetailsForm.value.partialPayment_3Date
        ? this.customerDetailsForm.value.partialPayment_3Date
        : null,
      partialPayment3Type: this.customerDetailsForm.value.partialPayment_3Type
        ? this.customerDetailsForm.value.partialPayment_3Type
        : null,
      partialPayment3CardDtls: this.customerDetailsForm.value
        .partialPayment_3CardDetails
        ? this.customerDetailsForm.value.partialPayment_3CardDetails
        : null,
      paritalPayment3InvNum: this.customerDetailsForm.value
        .partialPayment_3Invoice
        ? this.customerDetailsForm.value.partialPayment_3Invoice
        : null,
      partialPayment4Amt: this.customerDetailsForm.value.partialPayment_4Amount
        ? this.customerDetailsForm.value.partialPayment_4Amount
        : null,
      partialPayment4Date: this.customerDetailsForm.value.partialPayment_4Date
        ? this.customerDetailsForm.value.partialPayment_4Date
        : null,
      partialPayment4Type: this.customerDetailsForm.value.partialPayment_4Type
        ? this.customerDetailsForm.value.partialPayment_4Type
        : null,
      partialPayment4CardDtls: this.customerDetailsForm.value
        .partialPayment_4CardDetails
        ? this.customerDetailsForm.value.partialPayment_4CardDetails
        : null,
      paritalPayment4InvNum: this.customerDetailsForm.value
        .partialPayment_4Invoice
        ? this.customerDetailsForm.value.partialPayment_4Invoice
        : null,
      partialPayment5Amt: this.customerDetailsForm.value.partialPayment_5Amount
        ? this.customerDetailsForm.value.partialPayment_5Amount
        : null,
      partialPayment5Date: this.customerDetailsForm.value.partialPayment_5Date
        ? this.customerDetailsForm.value.partialPayment_5Date
        : null,
      partialPayment5Type: this.customerDetailsForm.value.partialPayment_5Type
        ? this.customerDetailsForm.value.partialPayment_5Type
        : null,
      partialPayment5CardDtls: this.customerDetailsForm.value
        .partialPayment_5CardDetails
        ? this.customerDetailsForm.value.partialPayment_5CardDetails
        : null,
      paritalPayment5InvNum: this.customerDetailsForm.value
        .partialPayment_5Invoice
        ? this.customerDetailsForm.value.partialPayment_5Invoice
        : null,
      partialPayment6Amt: this.customerDetailsForm.value.partialPayment_5Amount
        ? this.customerDetailsForm.value.partialPayment_5Amount
        : null,
      partialPayment6Date: this.customerDetailsForm.value.partialPayment_5Date
        ? this.customerDetailsForm.value.partialPayment_5Date
        : null,
      partialPayment6Type: this.customerDetailsForm.value.partialPayment_5Type
        ? this.customerDetailsForm.value.partialPayment_5Type
        : null,
      partialPayment6CardDtls: this.customerDetailsForm.value
        .partialPayment_5CardDetails
        ? this.customerDetailsForm.value.partialPayment_5CardDetails
        : null,
      paritalPayment6InvNum: this.customerDetailsForm.value
        .partialPayment_6Invoice
        ? this.customerDetailsForm.value.partialPayment_6Invoice
        : null,
      createdBy: this.loginUserDetails.username,
    };
    this.httpService.addCustomerPaymentDtls(request).subscribe(
      (res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            text: 'Customer payment details added  succcessfully!',
          });
          this.getAllCustomerPaymentDtls();
          this.myNgForm.resetForm();
          // Object.keys(this.customerDetailsForm.controls).forEach((key) => {
          //   this.customerDetailsForm.controls[key].setErrors(null);
          // });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Customer payment details failed to add! ',
          });
        }
      },
      (error) => {}
    );
  }

  deleteCustomerPaymentDtls(record: any) {
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
          id: record.customerPaymentDtls.id,
          modifiedBy: this.loginUserDetails.username,
        };
        this.httpService.deleteCustomerPaymentDtls(request).subscribe(
          (res) => {
            if (res) {
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
              this.getAllCustomerPaymentDtls();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Customer Payment details delete failed! ',
              });
            }
          },
          (error) => {}
        );
      }
    });
  }

  // onClose(){
  //   this.showCreateCustomerDetailsForm = false;
  // }

  onClickOfPartialPayment() {
    this.partialPayment = true;
  }

  onClickOfFullPayment() {
    this.fullPayment = true;
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

  getDuplicateCustomerPaymentDtls(event: any) {
    this.httpService
      .getDuplicateCustomerPaymentDtls(
        this.customerDetailsForm.value.tonTowReport.tonTowRptId
      )
      .subscribe((res) => {
        this.duplicateCustomerPaymentDetails = res;
        if (this.duplicateCustomerPaymentDetails.length !== 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This JobId already exists. Please enter a new id. The entered job id can be edited from View Police report.',
          });
          this.customerDetailsForm.controls['tonTowReport'].setErrors({
            incorrect: true,
          });
        }
      });
  }

  onEdit(record: any, index: number) {
    this.showUpdateRecordButton = true;
    this.selectedRecord = record;
    this.selectedRecordIndex = index;
    this.selectedCustomerPaymentJobNum = record.jobNum;
    //this.showCreateCustomerDetailsForm = true;
    this.customerDetailsForm.patchValue({
      id: record.customerPaymentDtls.id,
      tonTowReport: this.tonTowReportDropdownDetails.find(
        (elem: any) => elem.jobNum === record.jobNum
      ),
      PaymentMethodType: record.customerPaymentDtls.paymentType,
      fullPaymentDate: record.customerPaymentDtls.fullPaymentDate,
      fullPaymentAmount: record.customerPaymentDtls.fullPaymentAmt,
      fullPaymentType: record.customerPaymentDtls.fullPaymentType,
      fullPaymentCardDetails: record.customerPaymentDtls.fullPaymentCardDtls,
      fullPaymentInvoice: record.customerPaymentDtls.fullPaymentInvNum,
      partialPayment_1Amount: record.customerPaymentDtls.partialPayment1Amt,
      partialPayment_1Date: record.customerPaymentDtls.partialPayment1Date,
      partialPayment_1Type: record.customerPaymentDtls.partialPayment1Type,
      partialPayment_1CardDetails:
        record.customerPaymentDtls.paritalPayment1CardDtls,
      partialPayment_1Invoice: record.customerPaymentDtls.paritalPayment1InvNum,
      partialPayment_2Amount: record.customerPaymentDtls.partialPayment2Amt,
      partialPayment_2Date: record.customerPaymentDtls.partialPayment2Date,
      partialPayment_2Type: record.customerPaymentDtls.partialPayment2Type,
      partialPayment_2CardDetails:
        record.customerPaymentDtls.paritalPayment2CardDtls,
      partialPayment_2Invoice: record.customerPaymentDtls.paritalPayment2InvNum,
      partialPayment_3Amount: record.customerPaymentDtls.partialPayment3Amt,
      partialPayment_3Date: record.customerPaymentDtls.partialPayment3Date,
      partialPayment_3Type: record.customerPaymentDtls.partialPayment3Type,
      partialPayment_3CardDetails:
        record.customerPaymentDtls.paritalPayment3CardDtls,
      partialPayment_3Invoice: record.customerPaymentDtls.paritalPayment3InvNum,
      partialPayment_4Amount: record.customerPaymentDtls.partialPayment4Amt,
      partialPayment_4Date: record.customerPaymentDtls.partialPayment4Date,
      partialPayment_4Type: record.customerPaymentDtls.partialPayment4Type,
      partialPayment_4CardDetails:
        record.customerPaymentDtls.paritalPayment4CardDtls,
      partialPayment_4Invoice: record.customerPaymentDtls.paritalPayment4InvNum,
      partialPayment_5Amount: record.customerPaymentDtls.partialPayment5Amt,
      partialPayment_5Date: record.customerPaymentDtls.partialPayment5Date,
      partialPayment_5Type: record.customerPaymentDtls.partialPayment5Type,
      partialPayment_5CardDetails:
        record.customerPaymentDtls.paritalPayment5CardDtls,
      partialPayment_5Invoice: record.customerPaymentDtls.paritalPayment5InvNum,
      partialPayment_6Amount: record.customerPaymentDtls.partialPayment6Amt,
      partialPayment_6Date: record.customerPaymentDtls.partialPayment6Date,
      partialPayment_6Type: record.customerPaymentDtls.partialPayment6Type,
      partialPayment_6CardDetails:
        record.customerPaymentDtls.paritalPayment6CardDtls,
      partialPayment_6Invoice: record.customerPaymentDtls.paritalPayment6InvNum,
    });
    this.customerDetailsForm.controls['tonTowReport'].disable();
    this.initialDataSource.forEach((element:any,i:number) => {
      if(i === index){
        element.isEdit = true
      }else{
        element.isEdit = false
      }
    });
    this.dataSource = this.initialDataSource
  }

  updateCustomerPaymentDtls() {
    this.clearInputFieldsBasedOnPaymentType(this.customerDetailsForm.value.PaymentMethodType)
    let request = {
      id: this.customerDetailsForm.value.id,
      paymentType: this.customerDetailsForm.value.PaymentMethodType,
      fullPaymentAmt: this.customerDetailsForm.value.fullPaymentAmount
        ? this.customerDetailsForm.value.fullPaymentAmount
        : null,
      fullPaymentDate: this.customerDetailsForm.value.fullPaymentDate
        ? this.customerDetailsForm.value.fullPaymentDate
        : null,
      fullPaymentType: this.customerDetailsForm.value.fullPaymentType
        ? this.customerDetailsForm.value.fullPaymentType
        : null,
      fullPaymentCardDtls: this.customerDetailsForm.value.fullPaymentCardDetails
        ? this.customerDetailsForm.value.fullPaymentCardDetails
        : null,
      fullPaymentInvNum: this.customerDetailsForm.value.fullPaymentInvoice
        ? this.customerDetailsForm.value.fullPaymentInvoice
        : null,
      partialPayment1Amt: this.customerDetailsForm.value.partialPayment_1Amount
        ? this.customerDetailsForm.value.partialPayment_1Amount
        : null,
      partialPayment1Date: this.customerDetailsForm.value.partialPayment_1Date
        ? this.customerDetailsForm.value.partialPayment_1Date
        : null,
      partialPayment1Type: this.customerDetailsForm.value.partialPayment_1Type
        ? this.customerDetailsForm.value.partialPayment_1Type
        : null,
      paritalPayment1CardDtls: this.customerDetailsForm.value
        .partialPayment_1CardDetails
        ? this.customerDetailsForm.value.partialPayment_1CardDetails
        : null,
      paritalPayment1InvNum: this.customerDetailsForm.value
        .partialPayment_1Invoice
        ? this.customerDetailsForm.value.partialPayment_1Invoice
        : null,
      partialPayment2Amt: this.customerDetailsForm.value.partialPayment_2Amount
        ? this.customerDetailsForm.value.partialPayment_2Amount
        : null,
      partialPayment2Date: this.customerDetailsForm.value.partialPayment_2Date
        ? this.customerDetailsForm.value.partialPayment_2Date
        : null,
      partialPayment2Type: this.customerDetailsForm.value.partialPayment_2Type
        ? this.customerDetailsForm.value.partialPayment_2Type
        : null,
      paritalPayment2CardDtls: this.customerDetailsForm.value
        .partialPayment_2CardDetails
        ? this.customerDetailsForm.value.partialPayment_2CardDetails
        : null,
      paritalPayment2InvNum: this.customerDetailsForm.value
        .partialPayment_2Invoice
        ? this.customerDetailsForm.value.partialPayment_2Invoice
        : null,
      partialPayment3Amt: this.customerDetailsForm.value.partialPayment_3Amount
        ? this.customerDetailsForm.value.partialPayment_3Amount
        : null,
      partialPayment3Date: this.customerDetailsForm.value.partialPayment_3Date
        ? this.customerDetailsForm.value.partialPayment_3Date
        : null,
      partialPayment3Type: this.customerDetailsForm.value.partialPayment_3Type
        ? this.customerDetailsForm.value.partialPayment_3Type
        : null,
      paritalPayment3CardDtls: this.customerDetailsForm.value
        .partialPayment_3CardDetails
        ? this.customerDetailsForm.value.partialPayment_3CardDetails
        : null,
      paritalPayment3InvNum: this.customerDetailsForm.value
        .partialPayment_3Invoice
        ? this.customerDetailsForm.value.partialPayment_3Invoice
        : null,
      partialPayment4Amt: this.customerDetailsForm.value.partialPayment_4Amount
        ? this.customerDetailsForm.value.partialPayment_4Amount
        : null,
      partialPayment4Date: this.customerDetailsForm.value.partialPayment_4Date
        ? this.customerDetailsForm.value.partialPayment_4Date
        : null,
      partialPayment4Type: this.customerDetailsForm.value.partialPayment_4Type
        ? this.customerDetailsForm.value.partialPayment_4Type
        : null,
      paritalPayment4CardDtls: this.customerDetailsForm.value
        .partialPayment_4CardDetails
        ? this.customerDetailsForm.value.partialPayment_4CardDetails
        : null,
      paritalPayment4InvNum: this.customerDetailsForm.value
        .partialPayment_4Invoice
        ? this.customerDetailsForm.value.partialPayment_4Invoice
        : null,
      partialPayment5Amt: this.customerDetailsForm.value.partialPayment_5Amount
        ? this.customerDetailsForm.value.partialPayment_5Amount
        : null,
      partialPayment5Date: this.customerDetailsForm.value.partialPayment_5Date
        ? this.customerDetailsForm.value.partialPayment_5Date
        : null,
      partialPayment5Type: this.customerDetailsForm.value.partialPayment_5Type
        ? this.customerDetailsForm.value.partialPayment_5Type
        : null,
      paritalPayment5CardDtls: this.customerDetailsForm.value
        .partialPayment_5CardDetails
        ? this.customerDetailsForm.value.partialPayment_5CardDetails
        : null,
      paritalPayment5InvNum: this.customerDetailsForm.value
        .partialPayment_5Invoice
        ? this.customerDetailsForm.value.partialPayment_5Invoice
        : null,
      partialPayment6Amt: this.customerDetailsForm.value.partialPayment_6Amount
        ? this.customerDetailsForm.value.partialPayment_6Amount
        : null,
      partialPayment6Date: this.customerDetailsForm.value.partialPayment_6Date
        ? this.customerDetailsForm.value.partialPayment_6Date
        : null,
      partialPayment6Type: this.customerDetailsForm.value.partialPayment_6Type
        ? this.customerDetailsForm.value.partialPayment_6Type
        : null,
      paritalPayment6CardDtls: this.customerDetailsForm.value
        .partialPayment_6CardDetails
        ? this.customerDetailsForm.value.partialPayment_6CardDetails
        : null,
      paritalPayment6InvNum: this.customerDetailsForm.value
        .partialPayment_6Invoice
        ? this.customerDetailsForm.value.partialPayment_6Invoice
        : null,
      modifiedBy: this.loginUserDetails.username,
    };
    this.httpService.updateCustomerPaymentDtls(request).subscribe((res) => {
      if (res) {
        Swal.fire({
          icon: 'success',
          text: 'Customer Payment details updated successfully!',
        });
        this.getAllCustomerPaymentDtls();
        this.myNgForm.resetForm();
        this.OnClickOfCancel();
        // this.showCreateCustomerDetailsForm = false;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Customer Payment updated failed! ',
        });
      }
    });
  }

  highlight(element: any) {
    element.highlighted = !element.highlighted;
  }

  getDuplicateCustInsuranceCompUpdates(event: any) {
    this.httpService
      .getDuplicateCustInsuranceCompUpdates(
        this.customerDetailsForm.value.tonTowReport.tonTowRptId
      )
      .subscribe((res) => {
        this.checkCustomerInsuranceRecords = res;
        if (this.checkCustomerInsuranceRecords.length !== 0) {
          this.getDuplicateCustomerPaymentDtls(event);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            //text: 'Duplicate Adjuster details found for selected Job ID, Please select another one!',
            text: 'Please create Customer Insurance details and then create Customer Payment Details',
          });
        }
      });
  }

  clearInputFieldsBasedOnPaymentType(type: string) {
    if (type === 'Partial') {
      this.customerDetailsForm.patchValue({
        fullPaymentDate: '',
        fullPaymentAmount: '',
        fullPaymentType: '',
        fullPaymentCardDetails: '',
        fullPaymentInvoice: '',
      });
    } else {
      this.customerDetailsForm.patchValue({
        partialPayment_1Amount: '',
        partialPayment_1Date: '',
        partialPayment_1Type: '',
        partialPayment_1CardDetails: '',
        partialPayment_1Invoice: '',
        partialPayment_2Amount: '',
        partialPayment_2Date: '',
        partialPayment_2Type: '',
        partialPayment_2CardDetails: '',
        partialPayment_2Invoice: '',
        partialPayment_3Amount: '',
        partialPayment_3Date: '',
        partialPayment_3Type: '',
        partialPayment_3CardDetails: '',
        partialPayment_3Invoice: '',
        partialPayment_4Amount: '',
        partialPayment_4Date: '',
        partialPayment_4Type: '',
        partialPayment_4CardDetails: '',
        partialPayment_4Invoice: '',
        partialPayment_5Amount: '',
        partialPayment_5Date: '',
        partialPayment_5Type: '',
        partialPayment_5CardDetails: '',
        partialPayment_5Invoice: '',
        partialPayment_6Amount: '',
        partialPayment_6Date: '',
        partialPayment_6Type: '',
        partialPayment_6CardDetails: '',
        partialPayment_6Invoice: '',
      });
    }
  }

  OnClickOfCancel(){
    this.customerDetailsForm.reset();
    this.customerDetailsForm.controls['tonTowReport'].enable();
    this.selectedCustomerPaymentJobNum = '';
    this.initialDataSource.forEach((element:any,i:number) => {
      if(i === null){
        element.isEdit = true
      }else{
        element.isEdit = false
      }
    });
    this.dataSource =this.initialDataSource
  }

  numberOnly(event: any) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    return true;
  }

  preventPaste(event:any){
    event.preventDefault();
    event.stopPropagation();
  }

  clearFullDate(){
    this.customerDetailsForm.patchValue({
      fullPaymentDate: '',
    })
  }

  clearPartial_1Date(){
    this.customerDetailsForm.patchValue({
      partialPayment_1Date: '',
    });
  }
  clearPartial_2Date(){
    this.customerDetailsForm.patchValue({
      partialPayment_2Date: '',
    });
  }
  clearPartial_3Date(){
    this.customerDetailsForm.patchValue({
      partialPayment_3Date: '',
    });
  }
  clearPartial_4Date(){
    this.customerDetailsForm.patchValue({
      partialPayment_4Date: '',
    });
  }
  clearPartial_5Date(){
    this.customerDetailsForm.patchValue({
      partialPayment_5Date: '',
    });
  }
  clearPartial_6Date(){
    this.customerDetailsForm.patchValue({
      partialPayment_6Date: '',
    });
  }
  
}
