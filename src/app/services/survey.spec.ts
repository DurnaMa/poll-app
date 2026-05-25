import { TestBed } from '@angular/core/testing';

import { Survey } from './survey.services';

describe('Survey', () => {
  let service: Survey;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Survey);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
