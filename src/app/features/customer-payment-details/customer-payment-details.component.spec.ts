import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentDetailsComponent } from './customer-payment-details.component';

describe('CustomerPaymentDetailsComponent', () => {
  let component: CustomerPaymentDetailsComponent;
  let fixture: ComponentFixture<CustomerPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
