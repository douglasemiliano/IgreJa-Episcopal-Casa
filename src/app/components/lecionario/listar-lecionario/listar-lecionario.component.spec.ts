import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLecionarioComponent } from './listar-lecionario.component';

describe('ListarLecionarioComponent', () => {
  let component: ListarLecionarioComponent;
  let fixture: ComponentFixture<ListarLecionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarLecionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarLecionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
