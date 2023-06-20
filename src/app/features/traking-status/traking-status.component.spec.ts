import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrakingStatusComponent } from './traking-status.component';

describe('TrakingStatusComponent', () => {
  let component: TrakingStatusComponent;
  let fixture: ComponentFixture<TrakingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrakingStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrakingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
