import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyVotes } from './survey-votes';

describe('SurveyVotes', () => {
  let component: SurveyVotes;
  let fixture: ComponentFixture<SurveyVotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyVotes],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyVotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
