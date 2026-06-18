import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import Angular22Features from './angular22-features';

describe('Angular22FeaturesComponent', () => {
  let component: Angular22Features;
  let fixture: ComponentFixture<Angular22Features>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Angular22Features],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Angular22Features);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form due to empty fields', () => {
    expect(component['newsletterForm']().invalid()).toBe(true);
  });

  it('should be valid when all required fields are filled correctly', () => {
    // Modify the model signals
    component['newsletterModel'].set({
      fullName: 'Jean Dupont',
      email: 'jean.dupont@exemple.com',
      acceptTerms: true,
    });

    fixture.detectChanges();

    expect(component['newsletterForm']().valid()).toBe(true);
  });

  it('should be invalid when email format is incorrect', () => {
    component['newsletterModel'].set({
      fullName: 'Jean Dupont',
      email: 'invalid-email',
      acceptTerms: true,
    });

    fixture.detectChanges();

    expect(component['newsletterForm']().invalid()).toBe(true);
  });

  it('should be invalid when terms are not accepted', () => {
    component['newsletterModel'].set({
      fullName: 'Jean Dupont',
      email: 'jean.dupont@exemple.com',
      acceptTerms: false,
    });

    fixture.detectChanges();

    expect(component['newsletterForm']().invalid()).toBe(true);
  });
});
