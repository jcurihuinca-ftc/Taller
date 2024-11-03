import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionDeCitasPage } from './gestion-de-citas.page';

describe('GestionDeCitasPage', () => {
  let component: GestionDeCitasPage;
  let fixture: ComponentFixture<GestionDeCitasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDeCitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
