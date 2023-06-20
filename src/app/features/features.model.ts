export interface IAddFileClaim {
  tonTowRptId: number;
  fileClaimNumber: string;
  createdBy: string;
}

export interface IAddAppraiser {
  tonTowRptId: number;
  appraiserName: string;
  appraisedDate: string;
  companyName: string;
  claim: string;
  contactAddress: string;
  contactPhone: string;
  vehicleCondition: string;
  createdBy: string;
}

export interface IAddCustomerPaymentDtls {
  tonTowRptId: number;
  fullPayment: number;
  fullPaymentAmt: number;
  fullPaymentDate: string;
  fullPaymentType: string;
  fullPaymentCardDtls: string;
  partialPayment: number;
  partialPayment1Amt: number;
  partialPayment1Date: string;
  paritalPayment1CardDtls: string;
  partialPayment2Amt: number;
  partialPayment2Date: string;
  partialPayment2Type: string;
  paritalPayment2CardDtls: string;
  partialPayment3Amt: number;
  partialPayment3Date: string;
  partialPayment3Type: string;
  partialPayment3CardDtls: string;
  createdBy: string;
}

export interface IUpdateFileClaim {
  id: number;
  fileClaimNumber: string;
  modifiedBy: string;
}

export interface IUpdateAdjuster {
  id: number;
  adjusterName: string;
  appraisedDate: string;
  companyName: string;
  claim: string;
  contactAddress: string;
  contactPhone: string;
  modifiedBy: string;
}

export interface IUpdateAppraiser {
  id: number;
  appraiserName: string;
  appraisedDate: string;
  companyName: string;
  claim: string;
  contactAddress: string;
  contactPhone: string;
  vehicleCondition: string;
  modifiedBy: string;
}

export interface IAddCustomerContact {
  tonTowRptId: number;
  vehicleCondition: string;
  repairableNotes1: string;
  repairableNotes2: string;
  totaledNotes: string;
  createdBy: string;
}

export interface IUpdateCustomerContact {
  id: number;
  vehicleCondition: string;
  repairableNotes1: string;
  repairableNotes2: string;
  totaledNotes: string;
  status: boolean;
  modifiedBy: string;
}

export interface IDeleteAppraiser {
  id: number;
  modifiedBy: string;
}

export interface IDeleteAdjuster {
  id: number;
  modifiedBy: string;
}

// export interface IAddPoliceReport {
//   jobNum: string;
//   dateOfCrash: string;
//   timeOfCrash: string;
//   cityTown: string;
//   vehicleNumber: number;
//   injuredNumber: number;
//   speedLimit: number;
//   latitude: string;
//   longitude: string;
//   policeType: string;
//   other: string;
//   atIntersection: true;
//   aiRoute1: string;
//   aiDirection1: string;
//   aiRoadwayStName1: string;
//   aiRoute2: string;
//   aiDirection2: string;
//   aiRoadwayStName2: string;
//   aiRoute3: string;
//   aiDirection3: string;
//   aiRoadwayStName3: string;
//   naiRoute: string;
//   naiDirection: string;
//   naiAddress: string;
//   naiRoadwayStName: string;
//   naiFeet1: string;
//   naiDirection1: string;
//   naiMile: string;
//   naiExitNo: string;
//   naiFeet2: string;
//   naiDirection2: string;
//   naiRoute1: string;
//   naiRoadwaySt: string;
//   naiFeet3: string;
//   naiDirection3: string;
//   naiLandmark: string;
//   crashReportId: string;
//   crashNarrative: string;
//   createdBy: string;
//   addPoliceReportVehicleDtlsRequest: [
//     {
//       tonTowRptId: number;
//       vehicleNo: number;
//       crashType: string;
//       type: string;
//       action: string;
//       location: string;
//       condition: string;
//       occupants: number;
//       license: string;
//       street: string;
//       dobAge: string;
//       sex: string;
//       licClass: string;
//       licRestrictions: number;
//       cdlEndorsement: string;
//       operatorLastName: string;
//       operatorFirstName: string;
//       operatorMiddleName: string;
//       operatorAddress: string;
//       operatorCity: string;
//       operatorState: string;
//       operatorZip: string;
//       insuranceCompany: string;
//       vehicleTravelDirection: string;
//       respondingToEmergency: number;
//       citationIssued: string;
//       viol1: string;
//       viol2: string;
//       viol3: string;
//       viol4: string;
//       reg: string;
//       regType: string;
//       regState: string;
//       vehicleYear: string;
//       vehicleMake: string;
//       vehicleConfig: number;
//       ownerLastName: string;
//       ownerFirstName: string;
//       ownerMiddleName: string;
//       ownerAddress: string;
//       ownerCity: string;
//       ownerState: string;
//       ownerZip: string;
//       vehicleActionPriortoCrash: number;
//       eventSequence: number;
//       mostHarmfulEvent: number;
//       driverContributingCode: number;
//       driverDistractedBy: number;
//       damagedAreaCode: number;
//       testStatus: string;
//       typeofTest: string;
//       bacTestResult: string;
//       suspectedAlcohol: string;
//       suspectedDrug: string;
//       towedFromScene: number;
//     }
//   ];
//   addPoliceReportOperatorDtlsRequest: [
//     {
//       tonTowRptId: number;
//       vehicleNo: number;
//       operatorLastName: string;
//       operatorFirstName: string;
//       operatorMiddleName: string;
//       address: string;
//       city: string;
//       state: string;
//       zip: string;
//       dob: string;
//       sex: string;
//       seatPosition: number;
//       safetySystem: number;
//       airbagStatus: number;
//       ejectCode: number;
//       trapCode: number;
//       injuryStatus: number;
//       transpCode: number;
//       medicalFacility: string;
//     }
//   ];
//   addPoliceReportWitnessRequest: [
//     {
//       tonTowRptId: number;
//       lastName: string;
//       firstName: string;
//       middleName: string;
//       address: string;
//       city: string;
//       state: string;
//       zip: string;
//       phone: string;
//       statement: string;
//     }
//   ];
//   addPoliceReportPropertyDamageRequest: [
//     {
//       tonTowRptId: number;
//       ownerLastName: string;
//       ownerFirstName: string;
//       ownerMiddleName: string;
//       address: string;
//       city: string;
//       state: string;
//       zip: string;
//       phone: string;
//       fourOneType: string;
//       description: string;
//     }
//   ];
//   addPoliceReportTruckAndBusDtlsRequest: [
//     {
//       tonTowRptId: number;
//       vehicleNo: number;
//       registration: string;
//       carrierName: string;
//       busUse: string;
//       address: string;
//       city: string;
//       st: string;
//       zip: string;
//       usDot: string;
//       stateNumber: string;
//       issuingState: string;
//       mcmxicc: string;
//       interState: string;
//       cargoBodyType: string;
//       gvgcwr: string;
//       trailerReg: string;
//       regType: string;
//       regState: string;
//       regYear: string;
//       trailerLength: string;
//       placard: string;
//       material1: number;
//       materialName: string;
//       materialDigit: string;
//       releaseCode: number;
//       officerName: string;
//       idBadge: number;
//       department: string;
//       precinctBarracks: string;
//       date: string;
//     }
//   ];
//   addPoliceReportGeneralRequest: {
//     tonTowRptId: number;
//     accidentDate: string;
//     accidentTime: string;
//     reportingOfficer: string;
//     location: string;
//     city: string;
//     state: string;
//     zip: string;
//   };
//   addPoliceReportOperatorOwnerVehicleDtlsRequest: [
//     {
//       tonTowRptId: number;
//       operatorLastName: string;
//       operatorFirstName: string;
//       operatorMiddleName: string;
//       operatorSuffixName: string;
//       operatorVeh: number;
//       operatorInjured: true;
//       operatorFatality: true;
//       operatorNumber: number;
//       operatorStreet: string;
//       operatorStreetSuffix: string;
//       operatorStreetApt: string;
//       operatorCity: string;
//       operatorState: string;
//       operatorZip: string;
//       operatorDOB: string;
//       operatorHomePhone: string;
//       operatorWorkPhone: string;
//       operatorLic: string;
//       operatorStateNumber: string;
//       operatorInsuranceComp: string;
//       operatorPolicyNumber: string;
//       ownerLastName: string;
//       ownerFirstName: string;
//       ownerMiddleName: string;
//       ownerSuffixName: string;
//       ownerHomePhone: string;
//       ownerWorkPhone: string;
//       ownerNumber: number;
//       ownerStreet: string;
//       ownerStreetSuffix: string;
//       ownerStreetApt: string;
//       ownerCity: string;
//       ownerState: string;
//       ownerZip: string;
//       ownerInsuranceComp: string;
//       ownerPolicyNumber: string;
//       vehYear: string;
//       vehMake: string;
//       vehModel: string;
//       vehVin: string;
//       vehReg: string;
//       vehStateNumber: string;
//       vehTowedBy: string;
//       vehTowedTo: string;
//     }
//   ];
// }

export interface IUpdateCustomerPaymentDetails {
  id: number;
  paymentType: string;
  fullPaymentAmt: number;
  fullPaymentDate: string;
  fullPaymentType: string;
  fullPaymentCardDtls: string;
  fullPaymentInvNum: string;
  partialPayment1Amt: number;
  partialPayment1Date: string;
  partialPayment1Type: string;
  paritalPayment1CardDtls: string;
  paritalPayment1InvNum: string;
  partialPayment2Amt: number;
  partialPayment2Date: string;
  partialPayment2Type: string;
  paritalPayment2CardDtls: string;
  paritalPayment2InvNum: string;
  partialPayment3Amt: number;
  partialPayment3Date: string;
  partialPayment3Type: string;
  paritalPayment3CardDtls: string;
  paritalPayment3InvNum: string;
  partialPayment4Amt: number;
  partialPayment4Date: string;
  partialPayment4Type: string;
  paritalPayment4CardDtls: string;
  paritalPayment4InvNum: string;
  partialPayment5Amt: number;
  partialPayment5Date: string;
  partialPayment5Type: string;
  paritalPayment5CardDtls: string;
  paritalPayment5InvNum: string;
  partialPayment6Amt: number;
  partialPayment6Date: string;
  partialPayment6Type: string;
  paritalPayment6CardDtls: string;
  paritalPayment6InvNum: string;
  modifiedBy: string;
}


export interface IChangePassword {
  username: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}