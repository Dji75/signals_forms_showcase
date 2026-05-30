import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

interface RegistrationModel {
  fullName: string;
  newsletterOptIn: boolean;
  termsAccepted: boolean;
}

@Component({
  selector: 'app-submission',
  imports: [FormRoot, FormField, JsonPipe],
  templateUrl: './submission.html',
  styleUrl: './submission.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Submission {
  private readonly INITIAL_MODEL: RegistrationModel = {
    fullName: '',
    newsletterOptIn: false,
    termsAccepted: false,
  };

  // Model signal
  registerModel = signal<RegistrationModel>({ ...this.INITIAL_MODEL });

  // Custom flag to handle loading state
  isSubmitting = signal<boolean>(false);

  // Defining the form with validation AND submission action configuration
  registerForm = form(
    this.registerModel,
    (schemaPath) => {
      required(schemaPath.fullName, { message: 'Le nom complet est obligatoire' });
      // Validate terms and conditions
      required(schemaPath.termsAccepted, { message: 'Vous devez accepter les conditions d\'utilisation' });
    },
    {
      submission: {
        action: async (f) => {
          // This is triggered automatically if the form is valid!
          this.isSubmitting.set(true);
          console.log('Soumission du formulaire en cours...');
          
          // Simulate an API call
          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          console.log('Soumission réussie ! Données envoyées :', this.registerModel());
          alert('Inscription finalisée avec succès ! Le formulaire va être réinitialisé.');
          
          this.isSubmitting.set(false);
          
          // Reset interaction history (touched, dirty) and clear to initial state
          f().reset({ ...this.INITIAL_MODEL });
        },
      },
    }
  );

  // Manual trigger reset button
  manualReset() {
    this.registerForm().reset({ ...this.INITIAL_MODEL });
    console.log('Formulaire réinitialisé manuellement.');
  }
}
