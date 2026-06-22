import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import FormValueControlDemo from './form-value-control-demo';

describe('FormValueControlDemoComponent', () => {
  let component: FormValueControlDemo;
  let fixture: ComponentFixture<FormValueControlDemo>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormValueControlDemo],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormValueControlDemo);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Flush the mock HTTP requests loading code files
    const starsTsReq = httpMock.expectOne('/source/angular22-features/star-rating.ts');
    starsTsReq.flush('// Star Rating TS');

    const starsHtmlReq = httpMock.expectOne('/source/angular22-features/star-rating.html');
    starsHtmlReq.flush('<!-- Star Rating HTML -->');

    const moodTsReq = httpMock.expectOne('/source/angular22-features/mood-selector.ts');
    moodTsReq.flush('// Mood Selector TS');

    const moodHtmlReq = httpMock.expectOne('/source/angular22-features/mood-selector.html');
    moodHtmlReq.flush('<!-- Mood Selector HTML -->');

    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form due to empty comment', () => {
    expect(component['feedbackForm']().invalid()).toBe(true);
  });

  it('should be valid when stars are set and comment is filled', () => {
    component['feedbackModel'].set({
      mood: 'love',
      stars: 5,
      comment: 'Super service, je recommande !',
    });

    fixture.detectChanges();

    expect(component['feedbackForm']().valid()).toBe(true);
  });

  it('should be invalid when comment is empty', () => {
    component['feedbackModel'].set({
      mood: 'neutral',
      stars: 3,
      comment: '',
    });

    fixture.detectChanges();

    expect(component['feedbackForm']().invalid()).toBe(true);
  });
});
