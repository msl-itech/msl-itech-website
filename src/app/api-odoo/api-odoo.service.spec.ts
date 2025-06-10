import { TestBed } from '@angular/core/testing';

import { ApiOdooService } from './api-odoo.service';

describe('ApiOdooService', () => {
  let service: ApiOdooService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiOdooService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
