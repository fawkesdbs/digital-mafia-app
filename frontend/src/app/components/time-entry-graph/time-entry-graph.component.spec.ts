import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEntryGraphComponent } from './time-entry-graph.component';

describe('TimeEntryGraphComponent', () => {
  let component: TimeEntryGraphComponent;
  let fixture: ComponentFixture<TimeEntryGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeEntryGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeEntryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
