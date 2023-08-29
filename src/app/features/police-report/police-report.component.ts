import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  ValidationErrors,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpService } from 'src/app/services/http.service';
import { Observable, Subscription, elementAt } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { fromEvent } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { formatDate } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-police-report',
  templateUrl: './police-report.component.html',
  styleUrls: ['./police-report.component.scss'],
})
export class PoliceReportComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() viewReportID: number | undefined;
  @ViewChild('timepicker') timepicker: any;
  @ViewChild('stepper') stepper: any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('f') myNgForm: any;
  @Output() allowToNextTab = new EventEmitter<string>();
  policeReportForm_1!: FormGroup;
  policeReportForm_2!: FormGroup;
  policeReportForm_3!: FormGroup;
  policeReportForm_4!: FormGroup;
  policeReportForm_5!: FormGroup;
  witnessForm: FormGroup;
  generalOperatorForm: FormGroup;
  propertyDamageForm: FormGroup;
  truckAndBusInfoForm: FormGroup;
  generalInfoForm: FormGroup;
  stepperIndex: Number;
  tonTowReport: FormControl = new FormControl('', [Validators.required]);
  email: FormControl = new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z0-9._%"+-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'),]);
  phone: FormControl = new FormControl('', [Validators.required]);
  loginUserDetails: any;
  displayedColumns: string[] = [
    'operatorName',
    'address',
    'DOB/Age',
    'sex',
    'seatPosition',
    'safetySystem',
    'airBagStatus',
    'ejectCode',
    'trapCode',
    'injuryStatus',
    'transpCode',
    'medicalFacility',
  ];
  atIntersection: boolean = false;
  notAtIntersection: boolean = false;
  filteredOptions: any;
  @Input() tonTowReportDropdownDetails: any;
  dataSource = new MatTableDataSource<any>();
  getAllPoliceReportDetails: any;
  duplicatePoliceReportJobNumbers: any;
  subscription: Subscription;
  subscription1: Subscription;
  subscription2: Subscription;
  viewReportDetails: any;
  showNonMandetoryFields: boolean = false;
  showVehicle1OperatorDetails: boolean = false;
  showVehicle2OperatorDetails: boolean = false;
  showTruckandBusInfo: boolean = false;
  showPropertyDamage: boolean = false;
  showPoliceFields: boolean = false;
  showUpdateRecordButton: boolean = false;
  allPoliceReportDetails: any;
  completed1: boolean;
  completed2: boolean;
  viewReportEmailPhoneDetails: any;
  showHide: boolean = false;
  duplicateEmailPhone: any;
  editDuplicateEmailPhone: any;
  duplicateEmail: any;
  duplicatePhone: any;
  editDuplicateEmail: any;
  editDuplicatePhone: any;
  inputformControl: FormControl = new FormControl('', [Validators.required]);
  isdisabled: boolean = true;
  dateSelected: boolean = false;
  submitted: boolean;
  showTravelDirectionError: boolean;
  today = new Date(); 
  fileInfo: File;
  localUrl: string;
  format: string;
  url: string | ArrayBuffer | null;
  data: any;
  crashNarrative:any;
  crashNarrativeImage: any;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    this.initiateForms();
    // adding intially one operator for each vehicle
    if (!this.viewReportID) {
      this.addOperator(1);
      this.addOperator(2);
    }

    if (!this.viewReportID) {
      this.addWitness();
      this.addGeneralOperator(1);
      this.addGeneralOperator(2);
    }

    if (!this.viewReportID) {
      this.addPropertyDamage();
    }

    this.loginUserDetails = JSON.parse(sessionStorage.getItem('user') as string);
    if (this.loginUserDetails.role === 'user') {
      this.policeReportForm_1.disable();
    }
    if (this.loginUserDetails?.role === 'A') {
      this.filteredOptions = this.tonTowReportDropdownDetails;
      this.filteredOptions = this.tonTowReport.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    }
  }

  initiateForms() {
    this.policeReportForm_1 = this.fb.group({
      dateOfCrash: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      timeOfCrash: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      cityTown: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      vehicleNumbers: ['', [Validators.required]],
      injuredNumbers: ['', [Validators.required]],
      statePolice: [''],
      localPolice: [''],
      mbtaPolice: [''],
      campusPolice: [''],
      crashNarrativeDisplay: [''],
      others: [''],
      speedLimit: [''],
      latitude: [''],
      longitude: [''],
      route_1: ['',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      direction_1: [''],
      roadway_1: [''],
      route_2: [''],
      direction_2: [''],
      roadway_2: [''],
      route_3: [''],
      direction_3: [''],
      roadway_3: [''],
      intersection: [true],
      naiRoute: [''],
      naiDirection: [''],
      naiAddress: [''],
      feet1: [''],
      naiRoadwayStreet: [''],
      naiDirection1: [''],
      milemarker: [''],
      exitnumber: [''],
      feet2: [''],
      naiDirection2: [''],
      naiRoute1: [''],
      naiRoadwaySt1: [''],
      feet3: [''],
      naiDirection3: [''],
      naiLandmark: [''],
      crashNarrative: [''],
    });
    this.policeReportForm_2 = this.fb.group({
      id: [''],
      vehicle1: [true, [Validators.required]],
      veh1Occupants: ['', [Validators.required]],
      hitAndRun: [false],
      moped: [false],
      crashreportId: ['', [Validators.required]],
      veh1License: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh1State: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      veh1DOB: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh1Sex: ['', [Validators.required]],
      veh1LicClass: [''],
      veh1LicRestriction: [''],
      veh1CDLEndorsement: [''],
      veh1OperatorAddress: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh1OperatorLastName: ['', [Validators.required,Validators.pattern('^[^-\\s][a-zA-Z_\\s-]+$')]],
      veh1OperatorFirstName: ['', [Validators.required,Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')]],
      veh1OperatorMiddleName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
      veh1OperatorCity: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh1OperatorState: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh1OperatorZip: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh1InsuranceCompany: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh1VehTravelDirection: ['', [Validators.required]],
      veh1RespondingToEmergency: [null],
      veh1CitationIssued: [''],
      veh1Viol1: [''],
      veh1Viol2: [''],
      veh1Viol3: [''],
      veh1Viol4: [''],
      veh1Reg: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh1RegType: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh1RegState: ['', [Validators.required,Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')]],
      veh1VehicleYear: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh1VehicleMake: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh1VehicleConfig: [''],
      veh1OwnerLastName: ['', [Validators.required,Validators.pattern('^[^-\\s][a-zA-Z_\\s-]+$')]],
      veh1OwnerFirstName: ['', [Validators.required,Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')]],
      veh1OwnerMiddleName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
      veh1OwnerAddress: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh1OwnerCity: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh1OwnerState: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh1OwnerZip: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9]")]],
      veh1VehActionPriorToCrash: [null],
      veh1EventSeq1: [null],
      veh1EventSeq2: [null],
      veh1EventSeq3: [null],
      veh1EventSeq4: [null],
      veh1MostHarmfulEvent: [null],
      veh1DriverContributingCode1: [''],
      veh1DriverContributingCode2: [''],
      veh1DriverDistractedBy: [''],
      veh1DamagedAreaCode1: [''],
      veh1DamagedAreaCode2: [''],
      veh1DamagedAreaCode3: [''],
      veh1TestStatus: [''],
      veh1TypeOfTest: [''],
      veh1BACTestResult: [''],
      veh1SuspectedAlcohol: [''],
      veh1SuspectedDrug: [''],
      veh1TowedFromScene: [null],
      operatorVeh1DetailsArray: this.fb.array([]),
    });

    this.policeReportForm_3 = this.fb.group({
      id: [''],
      vehicle2: [true, [Validators.required]],
      veh2Occupants: ['', [Validators.required]],
      veh2Type: [''],
      veh2Action: [''],
      veh2Location: [''],
      veh2Condition: [''],
      hitAndRun2: [''],
      moped2: [''],
      veh2License: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh2State: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      veh2DOB: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh2Sex: ['', [Validators.required]],
      veh2LicClass: [''],
      veh2LicRestriction: [''],
      veh2CDLEndorsement: [''],
      veh2OperatorAddress: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh2OperatorLastName: ['', [Validators.required,Validators.pattern('^[^-\\s][a-zA-Z_\\s-]+$')]],
      veh2OperatorFirstName: ['', [Validators.required,Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')]],
      veh2OperatorMiddleName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
      veh2OperatorCity: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh2OperatorState2: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh2OperatorZip: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh2InsuranceCompany: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh2VehTravelDirection: ['', [Validators.required]],
      veh2RespondingToEmergency: [null],
      veh2CitationIssued: [''],
      veh2Viol1: [''],
      veh2Viol2: [''],
      veh2Viol3: [''],
      veh2Viol4: [''],
      veh2Reg: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh2RegType: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh2RegState: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh2VehicleYear: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh2VehicleMake: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh2VehicleConfig: [''],
      veh2OwnerLastName: ['', [Validators.required,Validators.pattern('^[^-\\s][a-zA-Z_\\s-]+$')]],
      veh2OwnerFirstName: ['', [Validators.required,Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')]],
      veh2OwnerMiddleName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
      veh2OwnerAddress: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh2OwnerCity: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh2OwnerState: ['', [Validators.required,Validators.pattern('^.*\\S.*[a-zA-Z ]')]],
      veh2OwnerZip: ['', [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      veh2VehActionPriorToCrash: [null],
      veh2EventSeq1: [null],
      veh2EventSeq2: [null],
      veh2EventSeq3: [null],
      veh2EventSeq4: [null],
      veh2MostHarmfulEvent: [null],
      veh2DriverContributingCode1: [''],
      veh2DriverContributingCode2: [''],
      veh2DriverDistractedBy: [''],
      veh2DamagedAreaCode1: [''],
      veh2DamagedAreaCode2: [''],
      veh2DamagedAreaCode3: [''],
      veh2TestStatus: [''],
      veh2TypeOfTest: [''],
      veh2BACTestResult: [''],
      veh2SuspectedAlcohol: [''],
      veh2SuspectedDrug: [''],
      veh2TowedFromScene: [null],
      operatorVeh2DetailsArray: this.fb.array([]),
    });
    this.truckAndBusInfoForm = this.fb.group({
      id: [''],
      vehicleNo: 1,
      registration: [''],
      carrierName: [''],
      busUse: [''],
      address: [''],
      city: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      st: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      zip: [''],
      usDot: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      stateNumber: [''],
      issuingState: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      mcmxicc: [''],
      interState: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      cargoBodyType: [''],
      gvgcwr: [''],
      trailerReg: [''],
      regState: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      regType: [''],
      regYear: [''],
      trailerLength: [''],
      placard: [''],
      material1: [''],
      materialName: [''],
      materialDigit: [''],
      releaseCode: [''],
      officerName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
      idBadge: [''],
      department: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
      precinctBarracks: [''],
      date: [''],
    });

    this.generalInfoForm = this.fb.group({
      id: [''],
      accidentDate: [null],
      accidentTime: [null],
      reportingOfficer: [''],
      location: [''],
      city: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      state: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      zip: [''],
    });
    this.witnessForm = this.fb.group({
      witnessFormArray: this.fb.array([]),
    });
    this.generalOperatorForm = this.fb.group({
      generalOperatorArray: this.fb.array([]),
    });
    this.propertyDamageForm = this.fb.group({
      propertyDamageFormArray: this.fb.array([]),
    });
    //to set default atIntersection value true 
    this.onIntersectionChange({value:true})
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['viewReportID'].currentValue) {
      this.showNonMandetoryFields = false;
      this.showVehicle1OperatorDetails = false;
      this.showVehicle2OperatorDetails = false;
      this.showTruckandBusInfo = false;
      this.showPropertyDamage = false;
      this.showPoliceFields = false;
      this.showUpdateRecordButton = false;
      this.showHide = false;
      this.stepper.selectedIndex = 0;
      this.viewReportID = changes['viewReportID'].currentValue;
      this.initiateForms();
      this.patchPoliceReportDetails();
      this.patchPoliceReportEmailPhone();
    }
  }
  getAllPoliceReport() {
    this.httpService.getAllPoliceReport().subscribe((res) => {
      this.allPoliceReportDetails = res;
    });
  }

  ngAfterViewInit() {
    this.paginator = this.paginator;
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(1500),
        distinctUntilChanged(),
        tap((text) => {
          console.log(this.input.nativeElement.value);
        })
      )
      .subscribe();
  }

  getVeh1OperatorArrayControls() {
    return (
      this.policeReportForm_2.get('operatorVeh1DetailsArray') as FormArray
    ).controls;
  }

  getVeh2OperatorArrayControls() {
    return (
      this.policeReportForm_3.get('operatorVeh2DetailsArray') as FormArray
    ).controls;
  }

  getWitnessArrayControls() {
    return (this.witnessForm.get('witnessFormArray') as FormArray).controls;
  }

  getPropertyDamageArrayControls() {
    return (this.propertyDamageForm.get('propertyDamageFormArray') as FormArray)
      .controls;
  }
  getgeneralOperatorArrayControls() {
    return (this.generalOperatorForm.get('generalOperatorArray') as FormArray)
      .controls;
  }

  addOperator(from: number, checkValidation: boolean = false) {
    let formArray;
    if (from === 1) {
      formArray = this.policeReportForm_2.get(
        'operatorVeh1DetailsArray'
      ) as FormArray;
    } else {
      formArray = this.policeReportForm_3.get(
        'operatorVeh2DetailsArray'
      ) as FormArray;
    }
    let validationcheckObject: any = {
      ...formArray.value[formArray.value.length - 1],
    };
    if (validationcheckObject) delete validationcheckObject.vehicleNo;
    if (
      checkValidation &&
      formArray.value.length !== 0 &&
      Object.values(validationcheckObject).every((x) => x === null || x === '')
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Fill one operator to select another one',
      });
    } else {
      let formGroup = this.fb.group({
        vehicleNo: from,
        operatorLastName: ['',Validators.pattern('^[^-\\s][a-zA-Z_\\s-]+$')],
        operatorFirstName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
        operatorMiddleName:  ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
        address: '',
        city:  ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
        state:  ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
        zip: '',
        dob: null,
        sex: '',
        seatPosition: null,
        safetySystem: null,
        airbagStatus: null,
        ejectCode: null,
        trapCode: null,
        injuryStatus: null,
        transpCode: null,
        medicalFacility: '',
      });
      formArray.push(formGroup);
    }
  }
  addWitness(checkValidation: boolean = false) {
    let formArray = this.witnessForm.get('witnessFormArray') as FormArray;
    if (
      checkValidation && formArray.value.length !== 0 &&
      Object.values(formArray.value[formArray.value.length - 1]).every(
        (x) => x === null || x === ''
      )
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Fill one Witness to select another one',
      });
    } else {
      let formGroup = this.fb.group({
        lastName: ['', [Validators.pattern('^[^-\\s][a-zA-Z_\\s-]+$')]],
        firstName: ['', [Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')]],
        middleName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
        address: ['', [Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
        phone: ['', [Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
        statement: ['', [Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
        city: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
        state: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
        zip: [''],
      });
      formArray.push(formGroup);
    }
  }
  addGeneralOperator(count: number) {
    let formArray = this.generalOperatorForm.get('generalOperatorArray') as FormArray;
    let formGroup = this.fb.group({
      operatorLastName: ['',Validators.pattern('^[^-\\s][a-zA-Z_\\s-]+$')],
      operatorFirstName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
      operatorMiddleName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
      operatorSuffixName: '',
      operatorVeh: [null],
      operatorInjured: false,
      operatorFatality: false,
      operatorNumber: [null],
      operatorStreet: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      operatorStreetSuffix: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      operatorStreetApt: '',
      operatorCity: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      operatorState: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      operatorZip: '',
      operatorDOB: [null],
      operatorHomePhone: '',
      operatorWorkPhone: '',
      operatorLic: '',
      operatorStateNumber: '',
      operatorInsuranceComp: '',
      operatorPolicyNumber: '',
      ownerLastName: ['',Validators.pattern('^[^-\\s][a-zA-Z_\\s-]+$')],
      ownerFirstName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
      ownerMiddleName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
      ownerSuffixName: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      ownerHomePhone: '',
      ownerWorkPhone: '',
      ownerNumber: [null],
      ownerStreet: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      ownerStreetSuffix: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      ownerStreetApt: '',
      ownerCity: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      ownerState: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
      ownerZip: '',
      ownerInsuranceComp: '',
      ownerPolicyNumber: '',
      vehYear: '',
      vehMake: '',
      vehModel: '',
      vehVin: ['',[Validators.required]],
      vehReg: '',
      vehStateNumber: '',
      vehTowedBy: '',
      vehTowedTo: '',
    });
    formArray.push(formGroup);
  }
  addPropertyDamage(checkValidation: boolean = false) {
    let formArray = this.propertyDamageForm.get(
      'propertyDamageFormArray'
    ) as FormArray;
    if (
      checkValidation &&
      formArray.value.length !== 0 &&
      Object.values(formArray.value[formArray.value.length - 1]).every(
        (x) => x === null || x === ''
      )
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Fill one Property to select another one',
      });
    } else {
      let formGroup = this.fb.group({
        ownerLastName: ['',Validators.pattern('^[^-\\s][a-zA-Z_\\s-]+$')],
        ownerFirstName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
        ownerMiddleName: ['',Validators.pattern('^[a-zA-Z][a-zA-Z]*(?:\s+[a-zA-Z][a-zA-Z]+)?$')],
        address: [''],
        phone: [''],
        fourOneType: [''],
        description: [''],
        city: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
        state: ['',Validators.pattern('^.*\\S.*[a-zA-Z ]')],
        zip: [''],
      });
      formArray.push(formGroup);
    }
  }

  removeOperator(from: number, i: number) {
    let formArray =
      from === 1
        ? (this.policeReportForm_2.get('operatorVeh1DetailsArray') as FormArray)
        : (this.policeReportForm_3.get(
            'operatorVeh2DetailsArray'
          ) as FormArray);
    formArray.removeAt(i);
  }

  removeWitness(i: any) {
    let formArray = this.witnessForm.get('witnessFormArray') as FormArray;
    formArray.removeAt(i);
  }

  removePropertyDamage(i: any) {
    let formArray = this.propertyDamageForm.get(
      'propertyDamageFormArray'
    ) as FormArray;
    formArray.removeAt(i);
  }

  onClickOfAtIntersection() {
    this.atIntersection = true;
  }

  onClickOfNotAtIntersection() {
    this.notAtIntersection = true;
  }

  getAutoCompleteOptionText(option: any) {
    return option.jobNum;
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
  getOperatorVehicleDetails() {
    let OperatorVehicleDetailsarray: any = [];
    this.policeReportForm_2.value.operatorVeh1DetailsArray.forEach(
      (element: any) => {
        if (!this.checkAllParamtersEmptyInObject(element, 'vehicleNo')) {
          OperatorVehicleDetailsarray.push(element);
        }
      }
    );
    this.policeReportForm_3.value.operatorVeh2DetailsArray.forEach(
      (element: any) => {
        if (!this.checkAllParamtersEmptyInObject(element, 'vehicleNo')) {
          OperatorVehicleDetailsarray.push(element);
        }
      }
    );
    return OperatorVehicleDetailsarray;
  }

  removeEmptyObjects(from: string) {
    let OperatorVehicleDetailsarray: any = [];
    if (from === 'propertyDamage') {
      this.propertyDamageForm.value.propertyDamageFormArray.forEach(
        (element: any) => {
          if (!this.checkAllParamtersEmptyInObject(element, 'id')) {
            OperatorVehicleDetailsarray.push(element);
          }
        }
      );
    } else if (from === 'witness') {
      this.witnessForm.value.witnessFormArray.forEach((element: any) => {
        if (!this.checkAllParamtersEmptyInObject(element, 'id')) {
          OperatorVehicleDetailsarray.push(element);
        }
      });
    }
    return OperatorVehicleDetailsarray;
  }

  //Police Report Main Table
  addPoliceReport() {
    this.tonTowReport.markAllAsTouched();
    this.email.markAllAsTouched();
    this.phone.markAllAsTouched();
    this.policeReportForm_1.markAllAsTouched();
    this.policeReportForm_2.markAllAsTouched();
    this.policeReportForm_3.markAllAsTouched();
    this.generalOperatorForm.markAllAsTouched();
    //this.inputformControl.markAsUntouched();
    let policeReportForm1Errors = this.getFormValidationErrors(
      this.policeReportForm_1
    );
    let policeReportForm2Errors = this.getFormValidationErrors(
      this.policeReportForm_2
    );
    let policeReportForm3Errors = this.getFormValidationErrors(
      this.policeReportForm_3
    );
    // let witnessformArray: any = this.witnessForm.get(
    //   'witnessFormArray'
    // ) as FormArray;
    // let witnessFormErrors: any = [];
    // witnessformArray.controls.forEach((element: any) => {
    //   witnessFormErrors.push(this.getFormValidationErrors(element));
    // });
    // let generalInfoFormErrors = this.getFormValidationErrors(
    //   this.generalInfoForm
    // );
    let generalOperatorformArray: any = this.generalOperatorForm.get(
      'generalOperatorArray'
    ) as FormArray;
    let generalOperatorFormErrors: any = [];
    generalOperatorformArray.controls.forEach((element: any) => {
      generalOperatorFormErrors.push(this.getFormValidationErrors(element));
    });

    let errorsString = '';
    if (policeReportForm1Errors.length !== 0) {
      errorsString =
        '<b>Police Report: </b><br>' + policeReportForm1Errors.join(',\n');
    }
    if (policeReportForm2Errors.length !== 0) {
      errorsString =
        errorsString +
        '<br><b>Vehicle 1: </b><br>' +
        policeReportForm2Errors.join(',\n');
    }
    if (policeReportForm3Errors.length !== 0) {
      errorsString =
        errorsString +
        '<b><br>Vehicle 2: </b><br>' +
        policeReportForm3Errors.join(',\n');
    }
    // if (witnessFormErrors.length !== 0) {
    //   errorsString =
    //     errorsString +
    //     '<b><br>Witness/Property Damage</b><br>' +
    //     witnessFormErrors.join(',\n');
    // }
    // if (generalInfoFormErrors.length !== 0) {
    //   errorsString =
    //     errorsString +
    //     '<b><br>Operator Information Sheet</b><br>' +
    //     generalInfoFormErrors.join(',\n');
    // }
    if (generalOperatorFormErrors.length !== 0) {
      errorsString =
        errorsString +
        '<b><br>Operator Information Sheet</b><br>' +
        generalOperatorFormErrors.join(',\n');
    }
    if (
      this.tonTowReport.valid &&
      this.email.valid &&
      this.phone.valid &&
      this.policeReportForm_1.valid &&
      this.policeReportForm_2.valid &&
      this.policeReportForm_3.valid &&
      this.generalOperatorForm.valid
    ) {
      let request: any = {
        jobNum: this.tonTowReport.value,
        emailId: this.email.value,
        phone: this.phone.value,
        dateOfCrash: this.policeReportForm_1.value.dateOfCrash,
        timeOfCrash: this.policeReportForm_1.value.timeOfCrash,
        cityTown: this.policeReportForm_1.value.cityTown,
        vehicleNumber: parseInt(this.policeReportForm_1.value.vehicleNumbers),
        injuredNumber: parseInt(this.policeReportForm_1.value.injuredNumbers),
        speedLimit: parseInt(this.policeReportForm_1.value.speedLimit),
        latitude: this.policeReportForm_1.value.latitude,
        longitude: this.policeReportForm_1.value.longitude,
        statePolice: this.policeReportForm_1.value.statePolice
          ? this.policeReportForm_1.value.statePolice
          : false,
        localPolice: this.policeReportForm_1.value.localPolice
          ? this.policeReportForm_1.value.localPolice
          : false,
        mbtaPolice: this.policeReportForm_1.value.mbtaPolice
          ? this.policeReportForm_1.value.mbtaPolice
          : false,
        campusPolice: this.policeReportForm_1.value.campusPolice
          ? this.policeReportForm_1.value.campusPolice
          : false,
        other: this.policeReportForm_1.value.others,
        atIntersection: this.policeReportForm_1.value.intersection
          ? JSON.parse(this.policeReportForm_1.value.intersection)
          : false,
        aiRoute1:
          this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.route_1
            ? this.policeReportForm_1.value.route_1
            : null,
        aiDirection1:
          this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.direction_1
            ? this.policeReportForm_1.value.direction_1
            : null,
        aiRoadwayStName1:
          this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.roadway_1
            ? this.policeReportForm_1.value.roadway_1
            : null,
        aiRoute2:
          this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.route_2
            ? this.policeReportForm_1.value.route_2
            : null,
        aiDirection2:
          this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.direction_2
            ? this.policeReportForm_1.value.direction_2
            : null,
        aiRoadwayStName2:
          this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.roadway_2
            ? this.policeReportForm_1.value.roadway_2
            : null,
        aiRoute3: this.policeReportForm_1.value.route_3
          ? this.policeReportForm_1.value.route_3
          : null,
        aiDirection3:
          this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.direction_3
            ? this.policeReportForm_1.value.direction_3
            : null,
        aiRoadwayStName3:
          this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.roadway_3
            ? this.policeReportForm_1.value.roadway_3
            : null,
        naiRoute:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.naiRoute
            ? this.policeReportForm_1.value.naiRoute
            : null,
        naiDirection:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.naiDirection
            ? this.policeReportForm_1.value.naiDirection
            : null,
        naiAddress:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.naiAddress
            ? this.policeReportForm_1.value.naiAddress
            : null,
        naiRoadwayStName:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.naiRoadwayStreet
            ? this.policeReportForm_1.value.naiRoadwayStreet
            : null,
        naiFeet1:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.feet1
            ? this.policeReportForm_1.value.feet1
            : null,
        naiDirection1:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.naiDirection1
            ? this.policeReportForm_1.value.naiDirection1
            : null,
        naiMile:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.milemarker
            ? this.policeReportForm_1.value.milemarker
            : null,
        naiExitNo:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.exitnumber
            ? this.policeReportForm_1.value.exitnumber
            : null,
        naiFeet2:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.feet2
            ? this.policeReportForm_1.value.feet2
            : null,
        naiDirection2:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.naiDirection2
            ? this.policeReportForm_1.value.naiDirection2
            : null,
        naiRoute1:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.naiRoute1
            ? this.policeReportForm_1.value.naiRoute1
            : null,
        naiRoadwaySt:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.naiRoadwaySt1
            ? this.policeReportForm_1.value.naiRoadwaySt1
            : null,
        naiFeet3:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.feet3
            ? this.policeReportForm_1.value.feet3
            : null,
        naiDirection3:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.naiDirection3
            ? this.policeReportForm_1.value.naiDirection3
            : null,
        naiLandmark:
          !this.policeReportForm_1.value.intersection &&
          this.policeReportForm_1.value.naiLandmark
            ? this.policeReportForm_1.value.naiLandmark
            : null,
        crashReportId: this.policeReportForm_2.value.crashreportId,
        crashNarrative: this.policeReportForm_1.value.crashNarrative,
        createdBy: this.loginUserDetails.username,
        addPoliceReportVehicleDtlsRequest: [],
        addPoliceReportOperatorDtlsRequest: this.getOperatorVehicleDetails(),
        addPoliceReportWitnessRequest: this.removeEmptyObjects('witness'),
        addPoliceReportPropertyDamageRequest:
          this.removeEmptyObjects('propertyDamage'),
        addPoliceReportTruckAndBusDtlsRequest:
          this.checkAllParamtersEmptyInObject(
            this.truckAndBusInfoForm.value,
            'vehicleNo'
          )
            ? []
            : [this.truckAndBusInfoForm.value],
        addPoliceReportGeneralRequest: this.generalInfoForm.value,

        addPoliceReportOperatorOwnerVehicleDtlsRequest:
          this.generalOperatorForm.value.generalOperatorArray,
      };

      //PoliceReport VehicleDtls 1
      request.addPoliceReportVehicleDtlsRequest.push({
        vehicleNo: 1,
        crashType: 'Vehicle',
        type: '',
        action: '',
        location: '',
        condition: '',
        occupants: Number(this.policeReportForm_2.value.veh1Occupants),
        license: this.policeReportForm_2.value.veh1License,
        street: this.policeReportForm_2.value.veh1State,
        dobAge: this.policeReportForm_2.value.veh1DOB,
        sex: this.policeReportForm_2.value.veh1Sex,
        licClass: this.policeReportForm_2.value.veh1LicClass,
        licRestrictions: Number(
          this.policeReportForm_2.value.veh1LicRestriction
        ),
        cdlEndorsement: this.policeReportForm_2.value.veh1CDLEndorsement,
        operatorLastName: this.policeReportForm_2.value.veh1OperatorLastName,
        operatorFirstName: this.policeReportForm_2.value.veh1OperatorFirstName,
        operatorMiddleName:
          this.policeReportForm_2.value.veh1OperatorMiddleName,
        operatorAddress: this.policeReportForm_2.value.veh1OperatorAddress,
        operatorCity: this.policeReportForm_2.value.veh1OperatorCity,
        operatorState: this.policeReportForm_2.value.veh1OperatorState,
        operatorZip: this.policeReportForm_2.value.veh1OperatorZip,
        insuranceCompany: this.policeReportForm_2.value.veh1InsuranceCompany,
        vehicleTravelDirection:
          this.policeReportForm_2.value.veh1VehTravelDirection,
        respondingToEmergency: Number(
          this.policeReportForm_2.value.veh1RespondingToEmergency
        ),
        citationIssued: String(this.policeReportForm_2.value.veh1CitationIssued),
        viol1: this.policeReportForm_2.value.veh1Viol1,
        viol2: this.policeReportForm_2.value.veh1Viol2,
        viol3: this.policeReportForm_2.value.veh1Viol3,
        viol4: this.policeReportForm_2.value.veh1Viol4,
        reg: this.policeReportForm_2.value.veh1Reg,
        regType: this.policeReportForm_2.value.veh1RegType,
        regState: this.policeReportForm_2.value.veh1RegState,
        vehicleYear: this.policeReportForm_2.value.veh1VehicleYear,
        vehicleMake: this.policeReportForm_2.value.veh1VehicleMake,
        vehicleConfig: Number(this.policeReportForm_2.value.veh1VehicleConfig),
        ownerLastName: this.policeReportForm_2.value.veh1OwnerLastName,
        ownerFirstName: this.policeReportForm_2.value.veh1OwnerFirstName,
        ownerMiddleName: this.policeReportForm_2.value.veh1OwnerMiddleName,
        ownerAddress: this.policeReportForm_2.value.veh1OwnerAddress,
        ownerCity: this.policeReportForm_2.value.veh1OwnerCity,
        ownerState: this.policeReportForm_2.value.veh1OwnerState,
        ownerZip: this.policeReportForm_2.value.veh1OwnerZip,
        vehicleActionPriortoCrash: Number(
          this.policeReportForm_2.value.veh1VehActionPriorToCrash
        ),
        eventSequence1: parseInt(this.policeReportForm_2.value.veh1EventSeq1),
        eventSequence2: parseInt(this.policeReportForm_2.value.veh1EventSeq2),
        eventSequence3: parseInt(this.policeReportForm_2.value.veh1EventSeq3),
        eventSequence4: parseInt(this.policeReportForm_2.value.veh1EventSeq4),
        mostHarmfulEvent: Number(
          this.policeReportForm_2.value.veh1MostHarmfulEvent
        ),
        driverContributingCode1: Number(
          this.policeReportForm_2.value.veh1DriverContributingCode1
        ),
        driverContributingCode2: Number(
          this.policeReportForm_2.value.veh1DriverContributingCode2
        ),
        driverDistractedBy: Number(
          this.policeReportForm_2.value.veh1DriverDistractedBy
        ),
        damagedAreaCode1: parseInt(
          this.policeReportForm_2.value.veh1DamagedAreaCode1
        ),
        damagedAreaCode2: parseInt(
          this.policeReportForm_2.value.veh1DamagedAreaCode2
        ),
        damagedAreaCode3: parseInt(
          this.policeReportForm_2.value.veh1DamagedAreaCode3
        ),
        testStatus: this.policeReportForm_2.value.veh1TestStatus,
        typeofTest: this.policeReportForm_2.value.veh1TypeOfTest,
        bacTestResult: this.policeReportForm_2.value.veh1BACTestResult,
        suspectedAlcohol: this.policeReportForm_2.value.veh1SuspectedAlcohol,
        suspectedDrug: this.policeReportForm_2.value.veh1SuspectedDrug,
        towedFromScene: Number(
          this.policeReportForm_2.value.veh1TowedFromScene
        ),
      });
      //PoliceReport VehicleDtls 2
      request.addPoliceReportVehicleDtlsRequest.push({
        vehicleNo: 2,
        crashType: 'string',
        type: this.policeReportForm_3.value.veh2Type,
        action: this.policeReportForm_3.value.veh2Action,
        location: this.policeReportForm_3.value.veh2Location,
        condition: this.policeReportForm_3.value.veh2Condition,
        occupants: Number(this.policeReportForm_3.value.veh2Occupants),
        license: this.policeReportForm_3.value.veh2License,
        street: this.policeReportForm_3.value.veh2State,
        dobAge: this.policeReportForm_3.value.veh2DOB,
        sex: this.policeReportForm_3.value.veh2Sex,
        licClass: this.policeReportForm_3.value.veh2LicClass,
        licRestrictions: Number(
          this.policeReportForm_3.value.veh2LicRestriction
        ),
        cdlEndorsement: this.policeReportForm_3.value.veh2CDLEndorsement,
        operatorLastName: this.policeReportForm_3.value.veh2OperatorLastName,
        operatorFirstName: this.policeReportForm_3.value.veh2OperatorFirstName,
        operatorMiddleName:
          this.policeReportForm_3.value.veh2OperatorMiddleName,
        operatorAddress: this.policeReportForm_3.value.veh2OperatorAddress,
        operatorCity: this.policeReportForm_3.value.veh2OperatorCity,
        operatorState: this.policeReportForm_3.value.veh2OperatorState2,
        operatorZip: this.policeReportForm_3.value.veh2OperatorZip,
        insuranceCompany: this.policeReportForm_3.value.veh2InsuranceCompany,
        vehicleTravelDirection:
          this.policeReportForm_3.value.veh2VehTravelDirection,
        respondingToEmergency: Number(
          this.policeReportForm_3.value.veh2RespondingToEmergency
        ),
        citationIssued: String(this.policeReportForm_3.value.veh2CitationIssued),
        viol1: this.policeReportForm_3.value.veh2Viol1,
        viol2: this.policeReportForm_3.value.veh2Viol2,
        viol3: this.policeReportForm_3.value.veh2Viol3,
        viol4: this.policeReportForm_3.value.veh2Viol4,
        reg: this.policeReportForm_3.value.veh2Reg,
        regType: this.policeReportForm_3.value.veh2RegType,
        regState: this.policeReportForm_3.value.veh2RegState,
        vehicleYear: this.policeReportForm_3.value.veh2VehicleYear,
        vehicleMake: this.policeReportForm_3.value.veh2VehicleMake,
        vehicleConfig: Number(this.policeReportForm_3.value.veh2VehicleConfig),
        ownerLastName: this.policeReportForm_3.value.veh2OwnerLastName,
        ownerFirstName: this.policeReportForm_3.value.veh2OwnerFirstName,
        ownerMiddleName: this.policeReportForm_3.value.veh2OwnerMiddleName,
        ownerAddress: this.policeReportForm_3.value.veh2OwnerAddress,
        ownerCity: this.policeReportForm_3.value.veh2OwnerCity,
        ownerState: this.policeReportForm_3.value.veh2OwnerState,
        ownerZip: this.policeReportForm_3.value.veh2OwnerZip,
        vehicleActionPriortoCrash: Number(
          this.policeReportForm_3.value.veh2VehActionPriorToCrash
        ),
        eventSequence1: parseInt(this.policeReportForm_3.value.veh2EventSeq1),
        eventSequence2: parseInt(this.policeReportForm_3.value.veh2EventSeq2),
        eventSequence3: parseInt(this.policeReportForm_3.value.veh2EventSeq3),
        eventSequence4: parseInt(this.policeReportForm_3.value.veh2EventSeq4),
        mostHarmfulEvent: Number(
          this.policeReportForm_3.value.veh2MostHarmfulEvent
        ),
        driverContributingCode1: Number(
          this.policeReportForm_3.value.veh2DriverContributingCode1
        ),
        driverContributingCode2: Number(
          this.policeReportForm_3.value.veh2DriverContributingCode2
        ),
        damagedAreaCode1: parseInt(
          this.policeReportForm_3.value.veh2DamagedAreaCode1
        ),
        damagedAreaCode2: parseInt(
          this.policeReportForm_3.value.veh2DamagedAreaCode2
        ),
        damagedAreaCode3: parseInt(
          this.policeReportForm_3.value.veh2DamagedAreaCode3
        ),
        testStatus: this.policeReportForm_3.value.veh2TestStatus,
        typeofTest: this.policeReportForm_3.value.veh2TypeOfTest,
        bacTestResult: this.policeReportForm_3.value.veh2BACTestResult,
        suspectedAlcohol: this.policeReportForm_3.value.veh2SuspectedAlcohol,
        suspectedDrug: this.policeReportForm_3.value.veh2SuspectedDrug,
        towedFromScene: Number(
          this.policeReportForm_3.value.veh2TowedFromScene
        ),
      });
      // request=this.customTrim(request)
      // this.checkDuplicatePoliceReport();
      // this.checkDuplicateEmail();
      // this.checkDuplicatePhone();

      this.httpService.addPoliceReport(request).subscribe(
        (res) => {
          if (res.result === 'Success') {
            Swal.fire({
              icon: 'success',
              text: 'Police Report details added  succcessfully!',
            });
            this.uploadTonTowReports(res.data.tonTowRptId);
            setTimeout(() => {
              this.onClickOfAddAndUpdateClearFields();
              window.location.reload();
            }, 3000);
          } else if (res.result === 'Failed') {
            Swal.fire({
              icon: 'error',
              text: 'Police Report details added  Failed!',
            });
          }
        },
        (error) => {
          let errorsArray: any = [];
          Object.keys(error.error.errors).forEach((key) => {
            errorsArray.push(error.error.errors[key][0]);
          });
          let errorString = errorsArray.join(',');

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorString,
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        width: 600,
        title: 'Please Fill all mandatory fields!',
        html: '<p>' + errorsString + '</p>',
      });
    }
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  checkDuplicatePoliceReport() {
    this.submitted = true;
    this.tonTowReport.markAllAsTouched();
    this.email.markAllAsTouched();
    this.phone.markAllAsTouched();
    this.policeReportForm_1.markAllAsTouched();
    this.policeReportForm_2.markAllAsTouched();
    this.policeReportForm_3.markAllAsTouched();
    this.generalOperatorForm.markAllAsTouched();
     if (
      this.tonTowReport.valid &&
       this.email.valid &&
       this.phone.valid 
     
     ) {
      this.httpService
        .checkDuplicatePoliceReport(this.tonTowReport.value)
        .subscribe((res) => {
          this.duplicatePoliceReportJobNumbers = res;
          if (this.duplicatePoliceReportJobNumbers.length !== 0) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'This JobId already exists. Please enter a new id. The entered job id can be edited from View Police report.',
            });

            this.tonTowReport.setErrors({ incorrect: true });
          } else {
            this.tonTowReport.setErrors(null);
           this.checkDuplicateEmail();
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        width: 600,
        title: 'Please Fill JobId, Email & Phone  to proceed!',
      });
    }
  }

  checkDuplicateEmail() {
    this.httpService.checkDuplicateEmail(this.email.value).subscribe((res) => {
      this.duplicateEmail = res;
      if (this.duplicateEmail.length !== 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Duplicate Email found, Please select another one',
        });
        this.email.setErrors({ incorrect: true });
      } else {
        this.email.setErrors(null);
        this.checkDuplicatePhone();
      }
    });
  }

  checkDuplicatePhone() {
    this.httpService.checkDuplicatePhone(this.phone.value).subscribe((res) => {
      this.duplicatePhone = res;
      if (this.duplicatePhone.length !== 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Duplicate Phone Number found, Please select another one',
        });
        this.phone.setErrors({ incorrect: true });
      } else {
        this.phone.setErrors(null);
        this.addPoliceReport();
       
      }
    });
  }

  patchPoliceReportEmailPhone() {
    this.httpService
      .getPoliceReportEmailPhone(this.viewReportID)
      .subscribe((res) => {
        this.viewReportEmailPhoneDetails = res;
        this.email.patchValue(this.viewReportEmailPhoneDetails[0].email);
        this.phone.patchValue(this.viewReportEmailPhoneDetails[0].phone);
      });
  }

  patchPoliceReportDetails() {
    if (this.viewReportID) {
      this.showUpdateRecordButton = true;
      this.httpService
        .getUserPoliceReportByID(this.viewReportID)
        .subscribe((res: any) => {
                    this.viewReportDetails = res;
          this.tonTowReport.patchValue(this.viewReportDetails.jobNum);
          let fileObject = this.viewReportDetails?.tonTowFileUploads.find((element:any) => { return element.fileType === "TonTowReport-CrashNarrative" && element.deleted === false })
          this.policeReportForm_1.patchValue({
            dateOfCrash: this.viewReportDetails.dateOfCrash,
            timeOfCrash: this.viewReportDetails.timeOfCrash,
            cityTown: this.viewReportDetails.cityTown,
            vehicleNumbers: this.viewReportDetails.vehicleNumber,
            injuredNumbers: this.viewReportDetails.injuredNumber,
            speedLimit: this.viewReportDetails.speedLimit,
            latitude: this.viewReportDetails.latitude,
            longitude: this.viewReportDetails.longitude,
            policeType: this.viewReportDetails.policeType,
            others: this.viewReportDetails.other,
            intersection: this.viewReportDetails.atIntersection,
            route_1: this.viewReportDetails.aiRoute1,
            direction_1: this.viewReportDetails.aiDirection1,
            roadway_1: this.viewReportDetails.aiRoadwayStName1,
            route_2: this.viewReportDetails.aiRoute2,
            direction_2: this.viewReportDetails.aiDirection2,
            roadway_2: this.viewReportDetails.aiRoadwayStName2,
            route_3: this.viewReportDetails.aiRoute3,
            direction_3: this.viewReportDetails.aiDirection3,
            roadway_3: this.viewReportDetails.aiRoadwayStName3,
            naiRoute: this.viewReportDetails.naiRoute,
            naiDirection: this.viewReportDetails.naiDirection,
            naiAddress: this.viewReportDetails.naiAddress,
            naiRoadwayStreet: this.viewReportDetails.naiRoadwayStName,
            feet1: this.viewReportDetails.naiFeet1,
            naiDirection1: this.viewReportDetails.naiDirection1,
            milemarker: this.viewReportDetails.naiMile,
            exitnumber: this.viewReportDetails.naiExitNo,
            feet2: this.viewReportDetails.naiFeet2,
            naiDirection2: this.viewReportDetails.naiDirection2,
            naiRoute1: this.viewReportDetails.naiRoute1,
            naiRoadwaySt1: this.viewReportDetails.naiRoadwaySt,
            feet3: this.viewReportDetails.naiFeet3,
            naiDirection3: this.viewReportDetails.naiDirection3,
            naiLandmark: this.viewReportDetails.naiLandmark,
            crashNarrative: this.viewReportDetails.crashNarrative,
            createdBy: this.loginUserDetails.username,
            statePolice: this.viewReportDetails.statePolice,
            localPolice: this.viewReportDetails.localPolice,
            mbtaPolice: this.viewReportDetails.mbtaPolice,
            campusPolice: this.viewReportDetails.campusPolice,
            crashNarrativeDisplay : fileObject?.fileName,
          });
          this.viewReportDetails.policeReportVehicleDtl.forEach(
            (object: any) => {
              if (object.vehicleNo === 1) {
                this.policeReportForm_2.patchValue({
                  id: object.id,
                  crashreportId: this.viewReportDetails.crashReportId,
                  vehicle1: object.vehicleNo,
                  veh1Occupants: object.occupants,
                  hitAndRun: object.type,
                  moped: '',
                  veh1License: object.license,
                  veh1State: object.street,
                  veh1DOB: object.dobAge,
                  veh1Sex: object.sex,
                  veh1LicClass: object.licClass,
                  veh1LicRestriction: object.licRestrictions,
                  veh1CDLEndorsement: object.cdlEndorsement,
                  veh1OperatorAddress: object.operatorAddress,
                  veh1OperatorLastName: object.operatorLastName,
                  veh1OperatorFirstName: object.operatorFirstName,
                  veh1OperatorMiddleName: object.operatorMiddleName,
                  veh1OperatorCity: object.operatorCity,
                  veh1OperatorState: object.operatorState,
                  veh1OperatorZip: object.operatorZip,
                  veh1InsuranceCompany: object.insuranceCompany,
                  veh1VehTravelDirection: object.vehicleTravelDirection,
                  veh1RespondingToEmergency: object.respondingToEmergency,
                  veh1CitationIssued: object.citationIssued,
                  veh1Viol1: object.viol1,
                  veh1Viol2: object.viol2,
                  veh1Viol3: object.viol3,
                  veh1Viol4: object.viol4,
                  veh1Reg: object.reg,
                  veh1RegType: object.regType,
                  veh1RegState: object.regState,
                  veh1VehicleYear: object.vehicleYear,
                  veh1VehicleMake: object.vehicleMake,
                  veh1VehicleConfig: object.vehicleConfig,
                  veh1OwnerLastName: object.ownerLastName,
                  veh1OwnerFirstName: object.ownerFirstName,
                  veh1OwnerMiddleName: object.ownerMiddleName,
                  veh1OwnerAddress: object.ownerAddress,
                  veh1OwnerCity: object.ownerCity,
                  veh1OwnerState: object.ownerState,
                  veh1OwnerZip: object.ownerZip,
                  veh1VehActionPriorToCrash: object.vehicleActionPriortoCrash,
                  veh1EventSeq1: object.eventSequence1,
                  veh1EventSeq2: object.eventSequence2,
                  veh1EventSeq3: object.eventSequence3,
                  veh1EventSeq4: object.eventSequence4,
                  veh1MostHarmfulEvent: object.mostHarmfulEvent,
                  veh1DriverContributingCode1: object.driverContributingCode1,
                  veh1DriverContributingCode2: object.driverContributingCode2,
                  veh1DriverDistractedBy: object.driverDistractedBy,
                  veh1DamagedAreaCode1: object.damagedAreaCode1,
                  veh1DamagedAreaCode2: object.damagedAreaCode2,
                  veh1DamagedAreaCode3: object.damagedAreaCode3,
                  veh1TestStatus: object.testStatus,
                  veh1TypeOfTest: object.typeofTest,
                  veh1BACTestResult: object.bacTestResult,
                  veh1SuspectedAlcohol: object.suspectedAlcohol,
                  veh1SuspectedDrug: object.suspectedDrug,
                  veh1TowedFromScene: object.towedFromScene,
                });
              } else {
                this.policeReportForm_3.patchValue({
                  id: object.id,
                  vehicle2: object.vehicleNo,
                  veh2Occupants: object.occupants,
                  veh2Type: object.type,
                  veh2Action: object.action,
                  veh2Location: object.location,
                  veh2Condition: object.condition,
                  hitAndRun2: object.condition,
                  moped2: object.condition,
                  veh2License: object.license,
                  veh2State: object.street,
                  veh2DOB: object.dobAge,
                  veh2Sex: object.sex,
                  veh2LicClass: object.licClass,
                  veh2LicRestriction: object.licRestrictions,
                  veh2CDLEndorsement: object.cdlEndorsement,
                  veh2OperatorAddress: object.operatorAddress,
                  veh2OperatorLastName: object.operatorLastName,
                  veh2OperatorFirstName: object.operatorFirstName,
                  veh2OperatorMiddleName: object.operatorMiddleName,
                  veh2OperatorCity: object.operatorCity,
                  veh2OperatorState2: object.operatorState,
                  veh2OperatorZip: object.operatorZip,
                  veh2InsuranceCompany: object.insuranceCompany,
                  veh2VehTravelDirection: object.vehicleTravelDirection,
                  veh2RespondingToEmergency: object.respondingToEmergency,
                  veh2CitationIssued: object.citationIssued,
                  veh2Viol1: object.viol1,
                  veh2Viol2: object.viol2,
                  veh2Viol3: object.viol3,
                  veh2Viol4: object.viol4,
                  veh2Reg: object.reg,
                  veh2RegType: object.regType,
                  veh2RegState: object.regState,
                  veh2VehicleYear: object.vehicleYear,
                  veh2VehicleMake: object.vehicleMake,
                  veh2VehicleConfig: object.vehicleConfig,
                  veh2OwnerLastName: object.ownerLastName,
                  veh2OwnerFirstName: object.ownerFirstName,
                  veh2OwnerMiddleName: object.ownerMiddleName,
                  veh2OwnerAddress: object.ownerAddress,
                  veh2OwnerCity: object.ownerCity,
                  veh2OwnerState: object.ownerState,
                  veh2OwnerZip: object.ownerZip,
                  veh2VehActionPriorToCrash: object.vehicleActionPriortoCrash,
                  veh2EventSeq1: object.eventSequence1,
                  veh2EventSeq2: object.eventSequence2,
                  veh2EventSeq3: object.eventSequence3,
                  veh2EventSeq4: object.eventSequence4,
                  veh2MostHarmfulEvent: object.mostHarmfulEvent,
                  veh2DriverContributingCode1: object.driverContributingCode1,
                  veh2DriverContributingCode2: object.driverContributingCode2,
                  veh2DriverDistractedBy: object.driverDistractedBy,
                  veh2DamagedAreaCode1: object.damagedAreaCode1,
                  veh2DamagedAreaCode2: object.damagedAreaCode2,
                  veh2DamagedAreaCode3: object.damagedAreaCode3,
                  veh2TestStatus: object.testStatus,
                  veh2TypeOfTest: object.typeofTest,
                  veh2BACTestResult: object.bacTestResult,
                  veh2SuspectedAlcohol: object.suspectedAlcohol,
                  veh2SuspectedDrug: object.suspectedDrug,
                  veh2TowedFromScene: object.towedFromScene,
                });
              }
            }
          );
          this.viewReportDetails.policeReportOperatorDtls.forEach(
            (operatorObject: any) => {
              this.patchOperatorDetails(
                operatorObject.vehicleNo,
                operatorObject
              );
            }
          );
          this.viewReportDetails.policeReportWitness.forEach(
            (witnessObject: any) => {
              this.patchWitness(witnessObject);
            }
          );
          this.viewReportDetails.policeReportPropertyDamage.forEach(
            (PropertyDamageObject: any) => {
              this.patchPropertyDamage(PropertyDamageObject);
            }
          );
          this.generalInfoForm.patchValue(
            this.viewReportDetails.policeReportGeneral[0]
          );
          this.truckAndBusInfoForm.patchValue(
            this.viewReportDetails.policeReportTruckAndBusDtl[0]
          );
          if (this.viewReportDetails.policeReportTruckAndBusDtl.length === 0) {
            this.truckAndBusInfoForm.removeControl('id');
          }
          if (
            this.viewReportDetails.policeReportTruckAndBusDtl[0] &&
            Object.values(this.viewReportDetails.policeReportTruckAndBusDtl[0])
              .length !== 0
          ) {
            this.showTruckandBusInfo = true;
          }

          this.viewReportDetails.policeReportOperatorOwnerVehicleDtls.forEach(
            (generalOperatorObject: any) => {
              this.patchGeneralOperator(generalOperatorObject);
            }
          );
          this.tonTowReport.disable();
          if(fileObject) this.crashNarrativeImage = 'data:image/jpeg;base64, ' + fileObject?.fileBytes
        });

    }
  }
  

 

  patchOperatorDetails(from: number, operatorObject: any) {
    let formArray;
    if (from === 1) {
      formArray = this.policeReportForm_2.get(
        'operatorVeh1DetailsArray'
      ) as FormArray;
    } else {
      formArray = this.policeReportForm_3.get(
        'operatorVeh2DetailsArray'
      ) as FormArray;
    }
    let formGroup = this.fb.group(operatorObject);

    formGroup.addControl('id', operatorObject.id);
    if (from === 1) {
      this.showVehicle1OperatorDetails = true;
    } else {
      this.showVehicle2OperatorDetails = true;
    }

    formArray.push(formGroup);
  }

  patchWitness(witnessObject: any) {
    let formArray = this.witnessForm.get('witnessFormArray') as FormArray;
    let formGroup = this.fb.group({
      id: witnessObject.id,
      lastName: [witnessObject.lastName, [Validators.required]],
      firstName: [witnessObject.firstName, [Validators.required]],
      middleName: [witnessObject.middleName],
      address: [witnessObject.address, [Validators.required]],
      phone: [witnessObject.phone, [Validators.required]],
      statement: [witnessObject.statement, [Validators.required]],
      city: [witnessObject.city],
      state: [witnessObject.state],
      zip: [witnessObject.zip],
    });

    formArray.push(formGroup);
  }

  patchPropertyDamage(PropertyDamageObject: any) {
    let formArray = this.propertyDamageForm.get(
      'propertyDamageFormArray'
    ) as FormArray;
    let formGroup = this.fb.group(PropertyDamageObject);
    formGroup.addControl('id', PropertyDamageObject.id);
    this.showPropertyDamage = true;
    formArray.push(formGroup);
  }

  patchGeneralOperator(generalOperatorObject: any) {
    let formArray = this.generalOperatorForm.get(
      'generalOperatorArray'
    ) as FormArray;
    let formGroup = this.fb.group(generalOperatorObject);
    formGroup.addControl('id', generalOperatorObject.id);
    formArray.push(formGroup);
  }

  public patchMultipleValues(formGroup: FormGroup, formValues: any) {
    for (let key in formValues) {
      let keyToPatch = key;
      let valueToPatch = formValues[key];

      // Patch value
      formGroup.patchValue({ [keyToPatch]: valueToPatch });
    }
  }

  updatePoliceReport() {
    this.tonTowReport.markAllAsTouched();
    this.email.markAllAsTouched();
    this.phone.markAllAsTouched();
    this.policeReportForm_1.markAllAsTouched();
    this.policeReportForm_2.markAllAsTouched();
    this.policeReportForm_3.markAllAsTouched();
    this.generalOperatorForm.markAllAsTouched();
    //this.inputformControl.markAsUntouched();
    let policeReportForm1Errors = this.getFormValidationErrors(
      this.policeReportForm_1
    );
    let policeReportForm2Errors = this.getFormValidationErrors(
      this.policeReportForm_2
    );
    let policeReportForm3Errors = this.getFormValidationErrors(
      this.policeReportForm_3
    );
    // let witnessformArray: any = this.witnessForm.get(
    //   'witnessFormArray'
    // ) as FormArray;
    // let witnessFormErrors: any = [];
    // witnessformArray.controls.forEach((element: any) => {
    //   witnessFormErrors.push(this.getFormValidationErrors(element));
    // });
    let generalOperatorformArray: any = this.generalOperatorForm.get(
      'generalOperatorArray'
    ) as FormArray;
    let generalOperatorFormErrors: any = [];
    generalOperatorformArray.controls.forEach((element: any) => {
      generalOperatorFormErrors.push(this.getFormValidationErrors(element));
    });

    let errorsString = '';
    if (policeReportForm1Errors.length !== 0) {
      errorsString =
        '<b>Police Report: </b>' + policeReportForm1Errors.join(',\n');
    }
    if (policeReportForm2Errors.length !== 0) {
      errorsString =
        errorsString +
        '<br><b>Vehicle 1: </b>' +
        policeReportForm2Errors.join(',\n');
    }
    if (policeReportForm3Errors.length !== 0) {
      errorsString =
        errorsString +
        '<b><br>Vehicle 2: </b>' +
        policeReportForm3Errors.join(',\n');
    }
    // if (witnessFormErrors.length !== 0) {
    //   errorsString =
    //     errorsString +
    //     '<b><br>Witness/Property Damage</b>' +
    //     witnessFormErrors.join(',\n');
    // }
    if (generalOperatorFormErrors.length !== 0) {
      errorsString =
        errorsString +
        '<b><br>Operator Information Sheet</b>' +
        generalOperatorFormErrors.join(',\n');
    }
    if (
      this.email.valid &&
      this.phone.valid &&
      this.policeReportForm_1.valid &&
      this.policeReportForm_2.valid &&
      this.policeReportForm_3.valid &&
      this.generalOperatorForm.valid
    ) {
    let request: any = {
      tonTowRptId: this.viewReportDetails.tonTowRptId,
      emailId: this.email.value,
      phone: this.phone.value,
      dateOfCrash: this.policeReportForm_1.value.dateOfCrash,
      timeOfCrash: this.policeReportForm_1.value.timeOfCrash,
      cityTown: this.policeReportForm_1.value.cityTown,
      vehicleNumber: parseInt(this.policeReportForm_1.value.vehicleNumbers),
      injuredNumber: parseInt(this.policeReportForm_1.value.injuredNumbers),
      speedLimit: parseInt(this.policeReportForm_1.value.speedLimit),
      latitude: this.policeReportForm_1.value.latitude,
      longitude: this.policeReportForm_1.value.longitude,
      statePolice: this.policeReportForm_1.value.statePolice
        ? this.policeReportForm_1.value.statePolice
        : false,
      localPolice: this.policeReportForm_1.value.localPolice
        ? this.policeReportForm_1.value.localPolice
        : false,
      mbtaPolice: this.policeReportForm_1.value.mbtaPolice
        ? this.policeReportForm_1.value.mbtaPolice
        : false,
      campusPolice: this.policeReportForm_1.value.campusPolice
        ? this.policeReportForm_1.value.campusPolice
        : false,
      other: this.policeReportForm_1.value.others,
      atIntersection: this.policeReportForm_1.value.intersection
        ? JSON.parse(this.policeReportForm_1.value.intersection)
        : false,
      aiRoute1: this.policeReportForm_1.value.route_1,
      aiDirection1: this.policeReportForm_1.value.direction_1,
      aiRoadwayStName1: this.policeReportForm_1.value.roadway_1,
      aiRoute2: this.policeReportForm_1.value.route_2,
      aiDirection2: this.policeReportForm_1.value.direction_2,
      aiRoadwayStName2: this.policeReportForm_1.value.roadway_2,
      aiRoute3: this.policeReportForm_1.value.route_3,
      aiDirection3: this.policeReportForm_1.value.direction_3,
      aiRoadwayStName3: this.policeReportForm_1.value.roadway_3,
      naiRoute: this.policeReportForm_1.value.naiRoute,
      naiDirection: this.policeReportForm_1.value.naiDirection,
      naiAddress: this.policeReportForm_1.value.naiAddress,
      naiRoadwayStName: this.policeReportForm_1.value.naiRoadwayStreet,
      naiFeet1: this.policeReportForm_1.value.feet1,
      naiDirection1: this.policeReportForm_1.value.naiDirection1,
      naiMile: this.policeReportForm_1.value.milemarker,
      naiExitNo: this.policeReportForm_1.value.exitnumber,
      naiFeet2: this.policeReportForm_1.value.feet2,
      naiDirection2: this.policeReportForm_1.value.naiDirection2,
      naiRoute1: this.policeReportForm_1.value.naiRoute1,
      naiRoadwaySt: this.policeReportForm_1.value.naiRoadwaySt1,
      naiFeet3: this.policeReportForm_1.value.feet3,
      naiDirection3: this.policeReportForm_1.value.naiDirection3,
      naiLandmark: this.policeReportForm_1.value.naiLandmark,
      crashReportId: this.policeReportForm_2.value.crashreportId,
      crashNarrative: this.policeReportForm_1.value.crashNarrative,
      modifiedBy: this.loginUserDetails.username,
      updatePoliceReportVehicleDtlsRequest: [],
      updatePoliceReportOperatorDtlsRequest: this.getOperatorVehicleDetails(),
      updatePoliceReportWitnessRequest: this.removeEmptyObjects('witness'),
      updatePoliceReportPropertyDamageRequest:
        this.removeEmptyObjects('propertyDamage'),
      updatePoliceReportTruckAndBusDtlsRequest:
        this.checkAllParamtersEmptyInObject(
          this.truckAndBusInfoForm.value,
          'vehicleNo'
        )
          ? []
          : [this.truckAndBusInfoForm.value],
      updatePoliceReportGeneralRequest: this.generalInfoForm.value,

      updatePoliceReportOperatorOwnerVehicleDtlsRequest:
        this.generalOperatorForm.value.generalOperatorArray,
    };
    //PoliceReport VehicleDtls 1
    request.updatePoliceReportVehicleDtlsRequest.push({
      id: this.policeReportForm_2.value.id,
      vehicleNo: 1,
      crashType: 'Vehicle',
      type: '',
      action: '',
      location: '',
      condition: '',
      occupants: Number(this.policeReportForm_2.value.veh1Occupants),
      license: this.policeReportForm_2.value.veh1License,
      street: this.policeReportForm_2.value.veh1State,
      dobAge: this.policeReportForm_2.value.veh1DOB,
      sex: this.policeReportForm_2.value.veh1Sex,
      licClass: this.policeReportForm_2.value.veh1LicClass,
      licRestrictions: Number(this.policeReportForm_2.value.veh1LicRestriction),
      cdlEndorememt: this.policeReportForm_2.value.veh1CDLEndorsement,
      operatorLastName: this.policeReportForm_2.value.veh1OperatorLastName,
      operatorFirstName: this.policeReportForm_2.value.veh1OperatorFirstName,
      operatorMiddleName: this.policeReportForm_2.value.veh1OperatorMiddleName,
      operatorAddress: this.policeReportForm_2.value.veh1OperatorAddress,
      operatorCity: this.policeReportForm_2.value.veh1OperatorCity,
      operatorState: this.policeReportForm_2.value.veh1OperatorState,
      operatorZip: this.policeReportForm_2.value.veh1OperatorZip,
      insuranceCompany: this.policeReportForm_2.value.veh1InsuranceCompany,
      vehicleTravelDirection:
        this.policeReportForm_2.value.veh1VehTravelDirection,
      respondingToEmergency: Number(
        this.policeReportForm_2.value.veh1RespondingToEmergency
      ),
      citationIssued: String(this.policeReportForm_2.value.veh1CitationIssued),
      viol1: this.policeReportForm_2.value.veh1Viol1,
      viol2: this.policeReportForm_2.value.veh1Viol2,
      viol3: this.policeReportForm_2.value.veh1Viol3,
      viol4: this.policeReportForm_2.value.veh1Viol4,
      reg: this.policeReportForm_2.value.veh1Reg,
      regType: this.policeReportForm_2.value.veh1RegType,
      regState: this.policeReportForm_2.value.veh1RegState,
      vehicleYear: this.policeReportForm_2.value.veh1VehicleYear,
      vehicleMake: this.policeReportForm_2.value.veh1VehicleMake,
      vehicleConfig: Number(this.policeReportForm_2.value.veh1VehicleConfig),
      ownerLastName: this.policeReportForm_2.value.veh1OwnerLastName,
      ownerFirstName: this.policeReportForm_2.value.veh1OwnerFirstName,
      ownerMiddleName: this.policeReportForm_2.value.veh1OwnerMiddleName,
      ownerAddress: this.policeReportForm_2.value.veh1OwnerAddress,
      ownerCity: this.policeReportForm_2.value.veh1OwnerCity,
      ownerState: this.policeReportForm_2.value.veh1OwnerState,
      ownerZip: this.policeReportForm_2.value.veh1OwnerZip,
      vehicleActionPriortoCrash: Number(
        this.policeReportForm_2.value.veh1VehActionPriorToCrash
      ),
      eventSequence1: parseInt(this.policeReportForm_2.value.veh1EventSeq1),
      eventSequence2: parseInt(this.policeReportForm_2.value.veh1EventSeq2),
      eventSequence3: parseInt(this.policeReportForm_2.value.veh1EventSeq3),
      eventSequence4: parseInt(this.policeReportForm_2.value.veh1EventSeq4),
      mostHarmfulEvent: Number(
        this.policeReportForm_2.value.veh1MostHarmfulEvent
      ),
      driverContributingCode1: Number(
        this.policeReportForm_2.value.veh1DriverContributingCode1
      ),
      driverContributingCode2: Number(
        this.policeReportForm_2.value.veh1DriverContributingCode2
      ),
      driverDistractedBy: Number(
        this.policeReportForm_2.value.veh1DriverDistractedBy
      ),
      damagedAreaCode1: parseInt(
        this.policeReportForm_2.value.veh1DamagedAreaCode1
      ),
      damagedAreaCode2: parseInt(
        this.policeReportForm_2.value.veh1DamagedAreaCode2
      ),
      damagedAreaCode3: parseInt(
        this.policeReportForm_2.value.veh1DamagedAreaCode3
      ),
      testStatus: this.policeReportForm_2.value.veh1TestStatus,
      typeofTest: this.policeReportForm_2.value.veh1TypeOfTest,
      bacTestResult: this.policeReportForm_2.value.veh1BACTestResult,
      suspectedAlcohol: this.policeReportForm_2.value.veh1SuspectedAlcohol,
      suspectedDrug: this.policeReportForm_2.value.veh1SuspectedDrug,
      towedFromScene: Number(this.policeReportForm_2.value.veh1TowedFromScene),
    });
    //PoliceReport VehicleDtls 2
    request.updatePoliceReportVehicleDtlsRequest.push({
      id: this.policeReportForm_3.value.id,
      vehicleNo: 2,
      crashType: 'string',
      type: this.policeReportForm_3.value.veh2Type,
      action: this.policeReportForm_3.value.veh2Action,
      location: this.policeReportForm_3.value.veh2Location,
      condition: this.policeReportForm_3.value.veh2Condition,
      occupants: Number(this.policeReportForm_3.value.veh2Occupants),
      license: this.policeReportForm_3.value.veh2License,
      street: this.policeReportForm_3.value.veh2State,
      dobAge: this.policeReportForm_3.value.veh2DOB,
      sex: this.policeReportForm_3.value.veh2Sex,
      licClass: this.policeReportForm_3.value.veh2LicClass,
      licRestrictions: Number(this.policeReportForm_3.value.veh2LicRestriction),
      cdlEndorememt: this.policeReportForm_3.value.veh2CDLEndorsement,
      operatorLastName: this.policeReportForm_3.value.veh2OperatorLastName,
      operatorFirstName: this.policeReportForm_3.value.veh2OperatorFirstName,
      operatorMiddleName: this.policeReportForm_3.value.veh2OperatorMiddleName,
      operatorAddress: this.policeReportForm_3.value.veh2OperatorAddress,
      operatorCity: this.policeReportForm_3.value.veh2OperatorCity,
      operatorState: this.policeReportForm_3.value.veh2OperatorState2,
      operatorZip: this.policeReportForm_3.value.veh2OperatorZip,
      insuranceCompany: this.policeReportForm_3.value.veh2InsuranceCompany,
      vehicleTravelDirection:
        this.policeReportForm_3.value.veh2VehTravelDirection,
      respondingToEmergency: Number(
        this.policeReportForm_3.value.veh2RespondingToEmergency
      ),
      citationIssued: this.policeReportForm_3.value.veh2CitationIssued,
      viol1: this.policeReportForm_3.value.veh2Viol1,
      viol2: this.policeReportForm_3.value.veh2Viol2,
      viol3: this.policeReportForm_3.value.veh2Viol3,
      viol4: this.policeReportForm_3.value.veh2Viol4,
      reg: this.policeReportForm_3.value.veh2Reg,
      regType: this.policeReportForm_3.value.veh2RegType,
      regState: this.policeReportForm_3.value.veh2RegState,
      vehicleYear: this.policeReportForm_3.value.veh2VehicleYear,
      vehicleMake: this.policeReportForm_3.value.veh2VehicleMake,
      vehicleConfig: Number(this.policeReportForm_3.value.veh2VehicleConfig),
      ownerLastName: this.policeReportForm_3.value.veh2OwnerLastName,
      ownerFirstName: this.policeReportForm_3.value.veh2OwnerFirstName,
      ownerMiddleName: this.policeReportForm_3.value.veh2OwnerMiddleName,
      ownerAddress: this.policeReportForm_3.value.veh2OwnerAddress,
      ownerCity: this.policeReportForm_3.value.veh2OwnerCity,
      ownerState: this.policeReportForm_3.value.veh2OwnerState,
      ownerZip: this.policeReportForm_3.value.veh2OwnerZip,
      vehicleActionPriortoCrash: Number(
        this.policeReportForm_3.value.veh2VehActionPriorToCrash
      ),
      eventSequence1: parseInt(this.policeReportForm_3.value.veh2EventSeq1),
      eventSequence2: parseInt(this.policeReportForm_3.value.veh2EventSeq2),
      eventSequence3: parseInt(this.policeReportForm_3.value.veh2EventSeq3),
      eventSequence4: parseInt(this.policeReportForm_3.value.veh2EventSeq4),
      mostHarmfulEvent: Number(
        this.policeReportForm_3.value.veh2MostHarmfulEvent
      ),
      driverContributingCode1: Number(
        this.policeReportForm_3.value.veh2DriverContributingCode1
      ),
      driverContributingCode2: Number(
        this.policeReportForm_3.value.veh2DriverContributingCode2
      ),
      driverDistractedBy: Number(
        this.policeReportForm_3.value.veh2DriverDistractedBy
      ),
      damagedAreaCode1: parseInt(
        this.policeReportForm_3.value.veh2DamagedAreaCode1
      ),
      damagedAreaCode2: parseInt(
        this.policeReportForm_3.value.veh2DamagedAreaCode2
      ),
      damagedAreaCode3: parseInt(
        this.policeReportForm_3.value.veh2DamagedAreaCode3
      ),
      testStatus: this.policeReportForm_3.value.veh2TestStatus,
      typeofTest: this.policeReportForm_3.value.veh2TypeOfTest,
      bacTestResult: this.policeReportForm_3.value.veh2BACTestResult,
      suspectedAlcohol: this.policeReportForm_3.value.veh2SuspectedAlcohol,
      suspectedDrug: this.policeReportForm_3.value.veh2SuspectedDrug,
      towedFromScene: Number(this.policeReportForm_3.value.veh2TowedFromScene),
    });
    this.httpService.updatePoliceReport(request).subscribe(
      (res) => {
          if (res.result === 'Success') {
          Swal.fire({
            icon: 'success',
            text: 'Police Report details updated  succcessfully!',
          });
          if(this.fileInfo) this.uploadTonTowReports(res.data.tonTowRptId);
          setTimeout(() => {
          this.onClickOfAddAndUpdateClearFields();
          window.location.reload();
          }, 3000);
        } else if (res.result === 'Failed') {
          Swal.fire({
            icon: 'error',
            text: 'Police Report details updated  Failed!',
          });
        }
      },
      (error) => {
        let errorsArray: any = [];
        Object.keys(error.error.errors).forEach((key) => {
          errorsArray.push(error.error.errors[key][0]);
        });
        let errorString = errorsArray.join(',');

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorString,
        });
      }
    );
    } else {
      Swal.fire({
        icon: 'error',
        width: 600,
        title: 'Please Fill all mandatory fields!',
        html: '<p>' + errorsString + '</p>',
      });
    }
  }

  deletePoliceReport() {
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
          tonTowRptId: this.tonTowReport.value,
          modifiedBy: this.loginUserDetails.username,
        };
        this.httpService.deletePoliceReport(request).subscribe(
          (res) => {
            if (res) {
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Police Report details not deleted!',
              });
            }
          },
          (error) => {}
        );
      }
    });
  }

  showClearConfirmation(tab: any) {
    if (
      this.policeReportForm_1.valid ||
      this.email.valid ||
      this.phone.valid ||
      this.tonTowReport.valid
    ) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You have not saved the Police report data. Do you still want to navigate to the other page?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.allowToNextTab.emit('allow');
        } else if (result.isDenied) {
          this.allowToNextTab.emit('');
        }
      });
    } else {
      this.allowToNextTab.emit('allow');
    }
  }

  OnClickOfCancel() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tonTowReport.enable();
        this.policeReportForm_1.reset();
        this.policeReportForm_2.reset();
        this.policeReportForm_3.reset();
        this.witnessForm.reset();
        this.propertyDamageForm.reset();
        this.truckAndBusInfoForm.reset();
        this.generalInfoForm.reset();
        this.generalOperatorForm.reset();
        this.tonTowReport.reset();
        this.email.reset();
        this.phone.reset();
        this.showUpdateRecordButton = false;
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
     
    });
  }

  onClickOfAddAndUpdateClearFields() {
    this.tonTowReport.enable();
    this.policeReportForm_1.reset();
    this.policeReportForm_2.reset();
    this.policeReportForm_3.reset();
    this.witnessForm.reset();
    this.propertyDamageForm.reset();
    this.truckAndBusInfoForm.reset();
    this.generalInfoForm.reset();
    this.generalOperatorForm.reset();
    this.tonTowReport.reset();
    this.email.reset();
    this.phone.reset();
    this.showUpdateRecordButton = false;
    this.changeDetectorRef.detectChanges();
    // setTimeout(() => {
    //   window.location.reload();
    // }, 800);
  }
  

  checkAllParamtersEmptyInObject(object: any, exceptKey: any) {
    for (const key in object) {
      if (object.hasOwnProperty(key) && key !== exceptKey && object[key]) {
        return false;
      }
    }
    return true;
  }

  onClickOfShow() {
    this.showNonMandetoryFields = true;
    this.showVehicle1OperatorDetails = true;
    this.showVehicle2OperatorDetails = true;
    this.showTruckandBusInfo = true;
    this.showPropertyDamage = true;
    this.showHide = true;
  }

  onClickOfHide() {
    this.showNonMandetoryFields = false;
    this.showVehicle1OperatorDetails = false;
    this.showVehicle2OperatorDetails = false;
    this.showPropertyDamage = false;
    this.showTruckandBusInfo = false;
    this.showHide = false;
  }

  getFormValidationErrors(formGroup: any) {
    let errorFields: any = [];
    Object.keys(formGroup.controls).forEach((key) => {
      const controlErrors: ValidationErrors = formGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            'Key control: ' + key + ', keyError: ' + keyError + ', err value: ',
            controlErrors[keyError]
          );
          errorFields.push(key);
        });
      }
    });
    return errorFields;
  }
  public onStepChange(event: any): void {
    switch (event.previouslySelectedIndex) {
      case 0:
        this.policeReportForm_1.markAllAsTouched();
        this.email.markAllAsTouched();
        this.phone.markAllAsTouched();
        if (
          this.policeReportForm_1.valid &&
          this.email.valid &&
          this.phone.valid
        ) {
          this.stepper.selectedIndex = event.selectedIndex;
        } else {
          this.stepper.selectedIndex = event.previouslySelectedIndex;
        }
        break;
      case 1:
        this.policeReportForm_2.markAllAsTouched();
        if (this.policeReportForm_2.valid) {
          this.stepper.selectedIndex = event.selectedIndex;
        } else {
          this.stepper.selectedIndex = event.previouslySelectedIndex;
        }
        break;
      case 2:
        this.policeReportForm_3.markAllAsTouched();
        if (this.policeReportForm_3.valid) {
          this.stepper.selectedIndex = event.selectedIndex;
        } else {
          this.stepper.selectedIndex = event.previouslySelectedIndex;
        }
        break;
      default:
        this.witnessForm.markAllAsTouched();
        if (this.witnessForm.valid) {
          this.stepper.selectedIndex = event.selectedIndex;
        } else {
          this.stepper.selectedIndex = event.previouslySelectedIndex;
        }
    }
  }

  onIntersectionChange(event: any) {
    if (event.value) {
      this.policeReportForm_1.controls['route_1'].setValidators([Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['direction_1'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['roadway_1'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['route_2'].setValidators([ Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['direction_2'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['roadway_2'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['route_3'].setValidators([Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['direction_3'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['roadway_3'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['naiRoute'].clearValidators();
      this.policeReportForm_1.controls['naiRoute'].updateValueAndValidity();
      this.policeReportForm_1.controls['naiDirection'].clearValidators();
      this.policeReportForm_1.controls['naiDirection'].updateValueAndValidity();
      this.policeReportForm_1.controls['naiAddress'].clearValidators();
      this.policeReportForm_1.controls['naiAddress'].updateValueAndValidity();
      this.policeReportForm_1.controls['feet1'].clearValidators();
      this.policeReportForm_1.controls['feet1'].updateValueAndValidity();
      this.policeReportForm_1.controls['naiRoadwayStreet'].clearValidators();
      this.policeReportForm_1.controls['naiRoadwayStreet'].updateValueAndValidity();
      this.policeReportForm_1.controls['naiDirection1'].clearValidators();
      this.policeReportForm_1.controls['naiDirection1'].updateValueAndValidity();
      this.policeReportForm_1.controls['milemarker'].clearValidators();
      this.policeReportForm_1.controls['milemarker'].updateValueAndValidity();
      this.policeReportForm_1.controls['exitnumber'].clearValidators();
      this.policeReportForm_1.controls['exitnumber'].updateValueAndValidity();
      this.policeReportForm_1.controls['feet2'].clearValidators();
      this.policeReportForm_1.controls['feet2'].updateValueAndValidity();
      this.policeReportForm_1.controls['naiDirection2'].clearValidators();
      this.policeReportForm_1.controls['naiDirection2'].updateValueAndValidity();
      this.policeReportForm_1.controls['naiRoute1'].clearValidators();
      this.policeReportForm_1.controls['naiRoute1'].updateValueAndValidity();
      this.policeReportForm_1.controls['naiRoadwaySt1'].clearValidators();
      this.policeReportForm_1.controls['naiRoadwaySt1'].updateValueAndValidity();
      this.policeReportForm_1.controls['feet3'].clearValidators();
      this.policeReportForm_1.controls['feet3'].updateValueAndValidity();
      this.policeReportForm_1.controls['naiDirection3'].clearValidators();
      this.policeReportForm_1.controls['naiDirection3'].updateValueAndValidity();
      this.policeReportForm_1.controls['naiLandmark'].clearValidators();
      this.policeReportForm_1.controls['naiLandmark'].updateValueAndValidity();
      this.policeReportForm_1.updateValueAndValidity();
    } else {
      this.policeReportForm_1.controls['route_1'].clearValidators();
      this.policeReportForm_1.controls['route_1'].updateValueAndValidity();
      this.policeReportForm_1.controls['direction_1'].clearValidators();
      this.policeReportForm_1.controls['direction_1'].updateValueAndValidity();
      this.policeReportForm_1.controls['roadway_1'].clearValidators();
      this.policeReportForm_1.controls['roadway_1'].updateValueAndValidity();
      this.policeReportForm_1.controls['route_2'].clearValidators();
      this.policeReportForm_1.controls['route_2'].updateValueAndValidity();
      this.policeReportForm_1.controls['direction_2'].clearValidators();
      this.policeReportForm_1.controls['direction_2'].updateValueAndValidity();
      this.policeReportForm_1.controls['roadway_2'].clearValidators();
      this.policeReportForm_1.controls['roadway_2'].updateValueAndValidity();
      this.policeReportForm_1.controls['route_3'].clearValidators();
      this.policeReportForm_1.controls['route_3'].updateValueAndValidity();
      this.policeReportForm_1.controls['direction_3'].clearValidators();
      this.policeReportForm_1.controls['direction_3'].updateValueAndValidity();
      this.policeReportForm_1.controls['roadway_3'].clearValidators();
      this.policeReportForm_1.controls['roadway_3'].updateValueAndValidity();
      this.policeReportForm_1.controls['naiRoute'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['naiDirection'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['naiAddress'].setValidators([Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['feet1'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['naiRoadwayStreet'].setValidators([Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['naiDirection1'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['milemarker'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['exitnumber'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['feet2'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['naiDirection2'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['naiRoute1'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['naiRoadwaySt1'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['feet3'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['naiDirection3'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.controls['naiLandmark'].setValidators([Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]);
      this.policeReportForm_1.updateValueAndValidity();
    }
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
    this.policeReportForm_1
      .get('dateOfCrash')
      ?.setValue(convertDate, { onlyself: true });
  }

  formatDateInVehicle1(e: any) {
    var d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    var convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    this.policeReportForm_2
      .get('veh1DOB')
      ?.setValue(convertDate, { onlyself: true });
  }

  formatDateInVehicle2(e: any) {
    var d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    var convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    this.policeReportForm_3
      .get('veh2DOB')
      ?.setValue(convertDate, { onlyself: true });
  }

  formatDateInTruckAndBus(e: any) {
    var d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    var convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    this.truckAndBusInfoForm
      .get('date')
      ?.setValue(convertDate, { onlyself: true });
  }

  formatDateInVehicle1Operator(e: any, i: number) {
    var d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    var convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    let formArray = this.policeReportForm_2.get(
      'operatorVeh1DetailsArray'
    ) as FormArray;
    formArray.controls[i].get('dob')?.setValue(convertDate, { onlyself: true });
  }

  formatDateInVehicle2Operator(e: any, i: number) {
    var d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    var convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    let formArray = this.policeReportForm_3.get(
      'operatorVeh2DetailsArray'
    ) as FormArray;
    formArray.controls[i].get('dob')?.setValue(convertDate, { onlyself: true });
  }

  formatDateInGeneral(e: any) {
    var d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    var convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    this.generalInfoForm
      .get('accidentDate')
      ?.setValue(convertDate, { onlyself: true });
  }

  formatDateInGeneralOperator(e: any, i: number) {
    var d = new Date(e.target.value);
    // This will return an ISO string matching your local time.
    var convertDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    ).toISOString();
    let formArray = this.generalOperatorForm.get(
      'generalOperatorArray'
    ) as FormArray;
    formArray.controls[i]
      .get('operatorDOB')
      ?.setValue(convertDate, { onlyself: true });
  }

  checkEditDuplicateEmail() {
    this.httpService
      .checkEditDuplicateEmail(
        this.email.value,
        this.viewReportDetails.tonTowRptId
      )
      .subscribe((res) => {
        this.editDuplicateEmail = res;
        if (this.editDuplicateEmail.length !== 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Duplicate Email found, Please select another one',
          });
          this.email.setErrors({ incorrect: true });
        } else {
          this.email.setErrors(null);
          this.checkEditDuplicatePhone();
        }
      });
  }

  checkEditDuplicatePhone() {
    this.httpService
      .checkEditDuplicatePhone(
        this.phone.value,
        this.viewReportDetails.tonTowRptId
      )
      .subscribe((res) => {
        this.editDuplicatePhone = res;
        if (this.editDuplicatePhone.length !== 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Duplicate Phone number found, Please select another one',
          });
          this.phone.setErrors({ incorrect: true });
        } else {
          this.phone.setErrors(null);
          this.updatePoliceReport();
        }
      });
  }

  preventPaste(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  // customTrim(Object:any) {
  //   for (const [k, v] of Object.entries(Object)) {
  //     if (Object(v) === v)
  //       this.customTrim(v)
  //     else if (typeof v === 'string')
  //     Object[k] = v.trim();
  //   }
  //   return Object;
  // }

  omit_special_char(event: any) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  deletePoliceReportOperatorDtls(i: number, from: any,item?:any) {
    if (item.value.id) {
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
          this.httpService.deletePoliceReportOperatorDtls(item.value.id).subscribe((res) => {
                if (res.result === 'Success') {
                  Swal.fire({
                    icon: 'success',
                    text: 'Police Report operator details deleted succcessfully!',
                  });
                  this.removeOperator(from, i);
                } else if (res.result === 'Failed') {
                  Swal.fire({
                    icon: 'error',
                    text: 'Police Report operator details delete Failed!',
                  });
                }
              },
              (error) => {}
            );
        }
      });
    } else {
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
          this.removeOperator(from, i);
        }
      });
    }
  }

  deletePoliceReportWitnessDtls(i: any) {
    if (
      this.viewReportDetails &&
      this.viewReportDetails.policeReportWitness[i] &&
      this.viewReportDetails.policeReportWitness[i].id
    ) {
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
          this.httpService
            .deletePoliceReportWitnessDtls(
              this.viewReportDetails.policeReportWitness[i].id
            )
            .subscribe(
              (res) => {
                if (res.result === 'Success') {
                  Swal.fire({
                    icon: 'success',
                    text: 'Police Report Witness details deleted succcessfully!',
                  });
                  this.removeWitness(i);
                } else if (res.result === 'Failed') {
                  Swal.fire({
                    icon: 'error',
                    text: 'Police Report Witness details delete Failed!',
                  });
                }
              },
              (error) => {}
            );
        }
      });
    } else {
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
          this.removeWitness(i);
        }
      });
    }
  }

  deletePoliceReportPropertyDamageDtls(i: any) {
    if (
      this.viewReportDetails &&
      this.viewReportDetails.policeReportPropertyDamage[i] &&
      this.viewReportDetails.policeReportPropertyDamage[i].id
    ) {
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
          this.httpService
            .deletePoliceReportPropertyDamageDtls(
              this.viewReportDetails.policeReportPropertyDamage[i].id
            )
            .subscribe(
              (res) => {
                if (res.result === 'Success') {
                  Swal.fire({
                    icon: 'success',
                    text: 'Police Report Property Damage details deleted succcessfully!',
                  });
                  this.removePropertyDamage(i);
                } else if (res.result === 'Failed') {
                  Swal.fire({
                    icon: 'error',
                    text: 'Police Report Property Damage details delete Failed!',
                  });
                }
              },
              (error) => {}
            );
        }
      });
    } else {
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
          this.removePropertyDamage(i);
        }
      });
    }
  }

  clearStartDate() {
    this.policeReportForm_1.patchValue({
      dateOfCrash: '',
    });
  }

  clearVehicle_1Date(){
    this.policeReportForm_2.patchValue({
      veh1DOB: '',
    });
  }

  clearVehicle_2Date(){
    this.policeReportForm_3.patchValue({
      veh2DOB: '',
    });
  }

  clearTruckAndBusDate(){
    this.truckAndBusInfoForm.patchValue({
      date: '',
    });
  }

  clearGeneralInfoDate(){
    this.generalInfoForm.patchValue({
      accidentDate: '',
    });
  }

  clearOperator_1Date(i: any) {
    let formArray = this.policeReportForm_2.get(
      'operatorVeh1DetailsArray'
    ) as FormArray;
    formArray.controls[i].get('dob')?.setValue('');
  }

  clearOperator_2Date(i: any) {
    let formArray = this.policeReportForm_3.get(
      'operatorVeh2DetailsArray'
    ) as FormArray;
    formArray.controls[i].get('dob')?.setValue('');
  }

  cleargeneralOperatorDate(k: any) {
    let formArray = this.generalOperatorForm.get(
      'generalOperatorArray'
    ) as FormArray;
    formArray.controls[k].get('operatorDOB')?.setValue('');
  }

  nextStep() {
    const currentStepIndex = this.stepper.selectedIndex;
    if (currentStepIndex == 1) {
      this.showTravelDirectionError = true;
    } else {
      this.showTravelDirectionError = false;
    }
  }
  onChangeInjured(event:any,index:number){
    let control = (this.generalOperatorForm.get('generalOperatorArray') as FormArray).controls[index] as FormGroup;
    if(event.checked){
      control.controls['operatorFatality'].disable()
    }else{
      control.controls['operatorFatality'].enable()
    }
  }
  onChangeFatality(event:any,index:number){
   let control = (this.generalOperatorForm.get('generalOperatorArray') as FormArray).controls[index] as FormGroup;
    if(event.checked){
      control.controls['operatorInjured'].disable()
    }else{
      control.controls['operatorInjured'].enable()
    }
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
      this.policeReportForm_1.patchValue({
        crashNarrativeDisplay: file.name,
      });
      if (event.target.files && event.target.files[0] && file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        if(file.type.indexOf('image')> -1){
          this.format = 'image';
        }
        reader.onload = (event: any) => {
          this.localUrl = file.webkitRelativePath;
          this.url = (<FileReader>event.target).result;
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

  uploadTonTowReports(tonTowRptId:number) {
    this.httpService
      .uploadTonTowReports(
        tonTowRptId,
        this.tonTowReport.value,
        this.loginUserDetails.username,
        "TonTowReport-CrashNarrative",
        this.fileInfo
      )
      .subscribe((res) => {
        res
      });
    }
    
}

