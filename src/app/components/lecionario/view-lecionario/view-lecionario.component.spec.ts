import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecionarioComponent } from './view-lecionario.component';

describe('LecionarioComponent', () => {
  let component: LecionarioComponent;
  let fixture: ComponentFixture<LecionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LecionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LecionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
