import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { SEOService } from './seo.service';

describe('SEOService', () => {
  let service: SEOService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SEOService,
        { provide: Meta, useValue: {} },
        { provide: Title, useValue: {} },
        { provide: Router, useValue: {} }
      ]
    });
    service = TestBed.inject(SEOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
