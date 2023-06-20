import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPoliceReportComponent } from './view-police-report.component';

describe('ViewPoliceReportComponent', () => {
  let component: ViewPoliceReportComponent;
  let fixture: ComponentFixture<ViewPoliceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPoliceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPoliceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
