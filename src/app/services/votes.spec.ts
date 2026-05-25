import { TestBed } from '@angular/core/testing';

import { VotesServices } from './votes.services';

describe('VotesServices', () => {
  let service: VotesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
