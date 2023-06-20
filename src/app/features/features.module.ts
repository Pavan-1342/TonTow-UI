import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

import { FeaturesRoutingModule } from './features-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatTabsModule} from '@angular/material/tabs';
import { PoliceReportComponent } from './police-report/police-report.component';
import { MatInputModule} from '@angular/material/input';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule} from '@angular/material/icon';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatStepperModule} from '@angular/material/stepper';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { UploadReportsComponent } from './upload-reports/upload-reports.component';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { FileClaimComponent } from './file-claim/file-claim.component'
import { AdjusterComponent } from './adjuster/adjuster.component';
import { AppraiserComponent } from './appraiser/appraiser.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CustomerContactComponent } from './customer-contact/customer-contact.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CustomerPaymentDetailsComponent } from './customer-payment-details/customer-payment-details.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AdjusterDialog, AppraiserDialog, FileClaimDialog, InsuranceDialog, PaymentDialog,TrakingStatusComponent } from './traking-status/traking-status.component';
import { MatTimepickerModule } from 'mat-timepicker';
import { ViewPoliceReportComponent } from './view-police-report/view-police-report.component';
import { AlphabetOnlyDirective } from './police-report/alphabet.directive';
import { CreateAdminComponent } from './create-admin/create-admin.component';

@NgModule({
    declarations: [
    DashboardComponent,
    PoliceReportComponent,
    ViewReportsComponent,
    UploadReportsComponent,
    FileClaimComponent,
    AdjusterComponent,
    AppraiserComponent,
    CustomerContactComponent,
    CustomerPaymentDetailsComponent,
    TrakingStatusComponent,
    ViewPoliceReportComponent,
    FileClaimDialog,
    AdjusterDialog, 
    AppraiserDialog, 
    InsuranceDialog, 
    PaymentDialog,
    AlphabetOnlyDirective,
    CreateAdminComponent
    
  ],
    imports: [
        CommonModule,
        FeaturesRoutingModule,
        MatTabsModule,
        MatInputModule,
      MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        FlexLayoutModule,
        MatIconModule,
        MatRippleModule,
        MatExpansionModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatRadioModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatTimepickerModule
      ],
      entryComponents:[FileClaimDialog, AdjusterDialog, AppraiserDialog, InsuranceDialog, PaymentDialog]
    
    })


    export class FeaturesModule { }