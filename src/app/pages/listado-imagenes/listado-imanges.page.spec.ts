import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoImagenesPage } from './listado-imagenes.page';


describe('HomeComponent', () => {
  let component: ListadoImagenesPage;
  let fixture: ComponentFixture<ListadoImagenesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoImagenesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoImagenesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
