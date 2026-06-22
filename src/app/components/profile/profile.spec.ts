import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import Profile from './profile';

describe('ProfileComponent', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Since ngOnInit triggers HTTP requests to load source files, let's flush those requests
    const tsRequest = httpMock.expectOne('/source/profile/profile.ts');
    tsRequest.flush('// Source TypeScript');

    const htmlRequest = httpMock.expectOne('/source/profile/profile.html');
    htmlRequest.flush('<!-- Source HTML -->');

    // The initial username 'dev_signals' triggers an immediate check to taken-usernames with its query parameter
    const usernameRequest = httpMock.expectOne('/api/taken-usernames.json?username=dev_signals');
    usernameRequest.flush(['admin', 'root', 'superman']);

    // Wait for the async resource promises to resolve
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with valid form values', () => {
    expect(component['profileForm']().valid()).toBe(true);
  });

  it('should validate email field as required', () => {
    component['profileModel'].update((m) => ({ ...m, email: '' }));
    fixture.detectChanges();
    expect(component['profileForm'].email().invalid()).toBe(true);
  });

  it('should trigger async validation for username and mark it as invalid if taken', async () => {
    // Set username to a taken one
    component['profileModel'].update((m) => ({ ...m, username: 'admin' }));
    fixture.detectChanges();

    // Wait 600ms for debounce (500ms debounce + margin)
    await new Promise((resolve) => setTimeout(resolve, 600));
    fixture.detectChanges();

    // We expect one HTTP request to the taken-usernames JSON with the specific username
    const req = httpMock.expectOne('/api/taken-usernames.json?username=admin');
    expect(req.request.method).toBe('GET');

    // Flush the list of taken usernames
    req.flush(['admin', 'root', 'superman']);

    // Wait for the async resource promises to resolve
    await fixture.whenStable();
    fixture.detectChanges();

    // Check status
    expect(component['profileForm'].username().pending()).toBe(false);
    expect(component['profileForm'].username().invalid()).toBe(true);
    expect(component['profileForm'].username().errors()[0]?.message).toContain('déjà pris');
  });

  it('should mark username as valid if it is not taken', async () => {
    // Set username to a unique one
    component['profileModel'].update((m) => ({ ...m, username: 'new_unique_user' }));
    fixture.detectChanges();

    // Wait 600ms for debounce (500ms debounce + margin)
    await new Promise((resolve) => setTimeout(resolve, 600));
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/taken-usernames.json?username=new_unique_user');
    req.flush(['admin', 'root', 'superman']);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component['profileForm'].username().pending()).toBe(false);
    expect(component['profileForm'].username().valid()).toBe(true);
  });
});
