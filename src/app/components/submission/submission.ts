import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';

interface RegistrationModel {
  fullName: string;
  newsletterOptIn: boolean;
  termsAccepted: boolean;
}

@Component({
  selector: 'app-submission',
  imports: [FormRoot, FormField, JsonPipe, CodeHighlightComponent],
  templateUrl: './submission.html',
  styleUrl: './submission.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Submission implements OnInit {
  private readonly http = inject(HttpClient);

  // Navigation Tab Signal
  protected readonly activeTab = signal<'demo' | 'ts' | 'html'>('demo');

  private readonly INITIAL_MODEL: RegistrationModel = {
    fullName: '',
    newsletterOptIn: false,
    termsAccepted: false,
  };

  // Model signal
  protected readonly registerModel = signal<RegistrationModel>({ ...this.INITIAL_MODEL });

  // Custom flag to handle loading state
  protected readonly isSubmitting = signal<boolean>(false);

  // Source code signals loaded via HTTP at runtime
  protected readonly tsCode = signal<string>('Chargement du code TypeScript...');
  protected readonly htmlCode = signal<string>('Chargement du code HTML...');

  ngOnInit(): void {
    const errorMsg = (filename: string) =>
      `⚠️ Impossible de charger "${filename}".\n\n` +
      `💡 Note : La configuration "angular.json" a été modifiée pour copier automatiquement les sources.\n` +
      `👉 Si vous voyez ce message, veuillez ARRÊTER votre serveur de développement (Ctrl+C) et le RELANCER avec "ng serve" pour appliquer la nouvelle configuration.`;

    this.http.get('/source/submission/submission.ts', { responseType: 'text' }).subscribe({
      next: (code) => this.tsCode.set(code),
      error: () => this.tsCode.set(errorMsg('submission.ts')),
    });

    this.http.get('/source/submission/submission.html', { responseType: 'text' }).subscribe({
      next: (code) => this.htmlCode.set(code),
      error: () => this.htmlCode.set(errorMsg('submission.html')),
    });
  }

  // Defining the form with validation AND submission action configuration
  protected readonly registerForm = form(
    this.registerModel,
    (schemaPath) => {
      required(schemaPath.fullName, { message: 'Le nom complet est obligatoire' });
      // Validate terms and conditions
      required(schemaPath.termsAccepted, { message: "Vous devez accepter les conditions d'utilisation" });
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
    },
  );

  // Manual trigger reset button
  protected manualReset(): void {
    this.registerForm().reset({ ...this.INITIAL_MODEL });
    console.log('Formulaire réinitialisé manuellement.');
  }
}
