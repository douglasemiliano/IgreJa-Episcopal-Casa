import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMembroComponent } from './listar-membro.component';

describe('ListarMembroComponent', () => {
  let component: ListarMembroComponent;
  let fixture: ComponentFixture<ListarMembroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarMembroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarMembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
