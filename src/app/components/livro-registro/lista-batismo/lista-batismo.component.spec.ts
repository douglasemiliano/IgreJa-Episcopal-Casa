import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaBatismoComponent } from './lista-batismo.component';

describe('ListaBatismoComponent', () => {
  let component: ListaBatismoComponent;
  let fixture: ComponentFixture<ListaBatismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaBatismoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaBatismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
