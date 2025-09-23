import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroBatismoComponent } from './registro-batismo.component';

describe('RegistroBatismoComponent', () => {
  let component: RegistroBatismoComponent;
  let fixture: ComponentFixture<RegistroBatismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroBatismoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroBatismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
