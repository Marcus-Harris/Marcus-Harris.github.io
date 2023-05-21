import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentTypeSettingsComponent } from './investment-type-settings.component';

describe('InvestmentTypeSettingsComponent', () => {
  let component: InvestmentTypeSettingsComponent;
  let fixture: ComponentFixture<InvestmentTypeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentTypeSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentTypeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
