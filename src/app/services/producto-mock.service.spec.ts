import { TestBed } from '@angular/core/testing';

import { ProductoMockService } from './producto-mock.service';

describe('ProductoMockService', () => {
  let service: ProductoMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
