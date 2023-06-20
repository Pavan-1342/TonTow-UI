import { Component, OnInit, ViewChild,ChangeDetectorRef, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpService } from 'src/app/services/http.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable, elementAt } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-customer-contact',
  templateUrl: './customer-contact.component.html',
  styleUrls: ['./customer-contact.component.scss'],
})
export class CustomerContactComponent implements OnInit  {
  @ViewChild(MatPaginator) scheduledOrdersPaginator: MatPaginator;
  @ViewChild('f') myNgForm: any;
  displayedColumns: string[] = [
    'jobNum',
    'repairableNotes1',
    'repairableNotes2',
    'totaledNotes',
    'vehicleCondition',
    'edit',
  ];
  table: any;
  //showCreateCustomerContactForm: boolean = false;
  repairable: boolean = false;
  totaled: boolean = false;
  loginUserDetails: any;
  tonTowReportId: any;
  getUserCustomerDetails: any = [];
  customerContactForm!: FormGroup;
   @Input() tonTowReportDropdownDetails: any;
  customerTableForm!: FormGroup;
  dataSource = new MatTableDataSource<any>();
  filteredOptions!: Observable<any[]>;
  duplicateCustomerInsDetails: any;
  getAllCustInsuranceCompDetails: any;
  showUpdateRecordButton: boolean= false;
  selectedCustomerInsuranceJobNum: any;
  checkAppraiserRecords: any;
  initialDataSource: any;
  selectedRowIndex = -1;
  userAppraiserDetails: any;

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.tonTowReportId = this.loginUserDetails?.tonTowRptId;
    this.customerContactForm = this.fb.group({
      id:[''],
      tonTowReport: ['', [Validators.required]],
      repairableNotes_1: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      repairableNotes_2: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      vehicleCondition: ['', [Validators.required,Validators.maxLength(25)]],
      totaledNotes: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
    });
    this.customerTableForm = this.fb.group({
      customerRows: this.fb.array([]),
    });
    this.getAllCustInsuranceCompUpdates();
     if(this.loginUserDetails?.role ==='A'){
      this.filteredOptions = this.tonTowReportDropdownDetails;
      this.filteredOptions = this.customerContactForm.controls['tonTowReport']?.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.cdr.detectChanges();
  }


  onClickOfRepairable() {
    this.repairable = true;
    this.customerContactForm.controls["totaledNotes"].clearValidators();
    this.customerContactForm.controls["totaledNotes"].updateValueAndValidity();
    this.customerContactForm.controls["repairableNotes_1"].setValidators([Validators.required,Validators.maxLength(50)]);
    this.customerContactForm.controls["repairableNotes_2"].setValidators([Validators.required,Validators.maxLength(50)]);
    this.customerContactForm.controls["repairableNotes_1"].updateValueAndValidity();
    this.customerContactForm.controls["repairableNotes_2"].updateValueAndValidity();
  }

  onClickOfTotaled() {
    this.totaled = true;
    this.customerContactForm.controls["totaledNotes"].setValidators([Validators.required,Validators.maxLength(50)]);
    this.customerContactForm.controls["totaledNotes"].updateValueAndValidity();
    this.customerContactForm.controls["repairableNotes_1"].clearValidators();
    this.customerContactForm.controls["repairableNotes_2"].clearValidators();
    this.customerContactForm.controls["repairableNotes_1"].updateValueAndValidity();
    this.customerContactForm.controls["repairableNotes_2"].updateValueAndValidity();
  }

  getAllCustInsuranceCompUpdates() {
    this.httpService.getAllCustInsuranceCompUpdates().subscribe((res) => {
      let data:any =[]
      res.forEach((Object:any) => {
        data.push({
          "jobNum":Object.jobNum,
          "repairableNotes1":Object.custInsuranceCompUpdate.repairableNotes1,
          "repairableNotes2":Object.custInsuranceCompUpdate.repairableNotes2,
          "totaledNotes":Object.custInsuranceCompUpdate.totaledNotes,
          "vehicleCondition":Object.custInsuranceCompUpdate.vehicleCondition,
          "custInsuranceCompUpdate":Object.custInsuranceCompUpdate,
          "isEdit":false
        })
      });
      this.initialDataSource = data
      this.dataSource = new MatTableDataSource(data as any);
      this.dataSource.paginator = this.scheduledOrdersPaginator;
      this.cdr.detectChanges();
    });
  }

  getUserCustInsuranceCompUpdates(tonTowReportId: any) {
    let request = {
      TonTowRptId: this.tonTowReportId,
    };
    this.httpService
      .getUserCustInsuranceCompUpdates(tonTowReportId, request)
      .subscribe((res) => {
        this.getUserCustomerDetails = res;
      });
  }

  // onClose() {
  //   this.showCreateCustomerContactForm = false;
  // }

  addCustInsuranceCompUpdates() {
    this.clearInputFieldsBasedOnVehicleCondition(this.customerContactForm.get('vehicleCondition')?.value)
    let request ={
        tonTowRptId: this.customerContactForm.value.tonTowReport.tonTowRptId,
        vehicleCondition: this.customerContactForm.controls['vehicleCondition'].value,
        repairableNotes1: this.customerContactForm.value.repairableNotes_1 ? this.customerContactForm.value.repairableNotes_1 : null,
        repairableNotes2: this.customerContactForm.value.repairableNotes_2 ? this.customerContactForm.value.repairableNotes_2 : null,
        totaledNotes: this.customerContactForm.value.totaledNotes ? this.customerContactForm.value.totaledNotes : null,
        createdBy: this.loginUserDetails.username,
      }
    this.httpService.addCustInsuranceCompUpdates(request).subscribe(
      (res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            text: 'Customer Insurance details added  succcessfully!',
          });
          this.getAllCustInsuranceCompUpdates();
          this.myNgForm.resetForm();
        //   Object.keys(this.customerContactForm.controls).forEach(key =>{
        //     this.customerContactForm.controls[key].setErrors(null)
        //  });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Customer Insurance failed to add! ',
          })
        }
      },
      (error) => {}
    );
  }


  onEdit(record:any,index:number){
this.showUpdateRecordButton = true;
this.selectedCustomerInsuranceJobNum = record.jobNum
    //this.showCreateCustomerContactForm = true;
    this.customerContactForm.patchValue({
      id:  record.custInsuranceCompUpdate.id,
      tonTowReport: this.tonTowReportDropdownDetails.find((obj:any)=>obj.jobNum === record.jobNum),
      repairableNotes_1: record.custInsuranceCompUpdate.repairableNotes1,
      repairableNotes_2:record.custInsuranceCompUpdate.repairableNotes2,
      vehicleCondition: record.custInsuranceCompUpdate.vehicleCondition,
      totaledNotes: record.custInsuranceCompUpdate.totaledNotes,
     
    });
    this.customerContactForm.controls['vehicleCondition'].disable();
    this.customerContactForm.controls['tonTowReport'].disable();
    this.initialDataSource.forEach((element:any,i:number) => {
      if(i === index){
        element.isEdit = true
      }else{
        element.isEdit = false
      }
    });
    this.dataSource =this.initialDataSource
   
  }

  updateCustInsuranceCompUpdates() {
    this.clearInputFieldsBasedOnVehicleCondition(this.customerContactForm.get('vehicleCondition')?.value)
    let request = {
      id: this.customerContactForm.value.id,
      vehicleCondition:this.customerContactForm.controls['vehicleCondition'].value,
      repairableNotes1:this.customerContactForm.value.repairableNotes_1,
      repairableNotes2:this.customerContactForm.value.repairableNotes_2,
      totaledNotes: this.customerContactForm.value.totaledNotes,
      modifiedBy: this.loginUserDetails.username,
    };
    this.httpService
      .updateCustInsuranceCompUpdates(request)
      .subscribe((res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            text: 'Customer Insruance details updated  succcessfully!',
          });
          this.getAllCustInsuranceCompUpdates();
          this.myNgForm.resetForm();
          this.OnClickOfCancel();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Customer Insruance details updated failed! ',
          })
        }
      });
  }

  deleteCustInsuranceCompUpdates(record:any) {
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
          id: record.custInsuranceCompUpdate.id,
          modifiedBy: this.loginUserDetails.username,
        };
        this.httpService.deleteCustInsuranceCompUpdates(request).subscribe(
          (res) => {
            if (res) {
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
              // this.snackBar.open('Customer contact details deleted', 'close', {
              //   //duration: 2000,
              //   horizontalPosition: 'end',
              //   verticalPosition: 'top',
              // });
              this.getAllCustInsuranceCompUpdates();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Customer contact details delete failed! ',
              })
            }
          },
          (error) => {}
        );
      }
    });
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
    if (typeof(value) !== "object" && value) {
      const filterValue = value;
      return this.tonTowReportDropdownDetails.filter((option: any) =>
        option.jobNum.toLowerCase().includes(filterValue)
      );
    } else {
      return this.tonTowReportDropdownDetails;
    }
  }

  getDuplicateCustInsuranceCompUpdates(event:any){
    this.httpService.getDuplicateCustInsuranceCompUpdates(this.customerContactForm.value.tonTowReport.tonTowRptId).subscribe((res)=>{
      this.duplicateCustomerInsDetails = res;
      if(this.duplicateCustomerInsDetails.length !== 0){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'This JobId already exists. Please enter a new id. The entered job id can be edited from View Police report. ',
        })
        this.customerContactForm.controls['tonTowReport'].setErrors({'incorrect': true});
      }
      this.httpService.getUserAppraiser(this.customerContactForm.value.tonTowReport.tonTowRptId).subscribe(
        (res) => {
          this.userAppraiserDetails = res;
          this.customerContactForm.controls['vehicleCondition'].setValue( this.userAppraiserDetails[0].appraiser.vehicleCondition)
          this.customerContactForm.controls['vehicleCondition'].disable()
        },
        (error) => {
          this.snackBar.open(error.error, 'close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      );
    })
  }

  highlight(element: any) {
    element.highlighted = !element.highlighted;
  }

  getDuplicateAppraiser(event: any) {
    this.httpService
      .getDuplicateAppraiser(this.customerContactForm.value.tonTowReport.tonTowRptId)
      .subscribe((res) => {
        this.checkAppraiserRecords = res;
        if (this.checkAppraiserRecords.length !== 0) {
         this.getDuplicateCustInsuranceCompUpdates(event);
        }else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            //text: 'Duplicate Adjuster details found for selected Job ID, Please select another one!',
            text: 'Please create Appraiser details and then create Customer Insurance status',
          });
        }
      });
  }

  clearInputFieldsBasedOnVehicleCondition(type: string) {
    if (type === 'Repairable') {
      this.customerContactForm.patchValue({
        totaledNotes: '',
      
      });
    } else {
      this.customerContactForm.patchValue({
        repairableNotes_1: '',
        repairableNotes_2: '',
       
      });
    }
  }

  OnClickOfCancel(){
    this.customerContactForm.reset();
    this.customerContactForm.controls['tonTowReport'].enable();
    this.selectedCustomerInsuranceJobNum = '';
    this.initialDataSource.forEach((element:any,i:number) => {
      if(i === null){
        element.isEdit = true
      }else{
        element.isEdit = false
      }
    });
    this.dataSource =this.initialDataSource
  }

  preventPaste(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

}
