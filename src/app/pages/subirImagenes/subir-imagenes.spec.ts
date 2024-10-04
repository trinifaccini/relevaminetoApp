import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubidaPage } from './subir-imagenes.page';


describe('HomeComponent', () => {
  let component: SubidaPage;
  let fixture: ComponentFixture<SubidaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubidaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
