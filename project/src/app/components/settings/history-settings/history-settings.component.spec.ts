import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorySettingsComponent } from './history-settings.component';

describe('HistorySettingsComponent', () => {
  let component: HistorySettingsComponent;
  let fixture: ComponentFixture<HistorySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorySettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
