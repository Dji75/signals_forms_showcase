import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { form, FormField, FormRoot, required, email } from '@angular/forms/signals';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';
import { CustomInputComponent } from './custom-input';
import { timer, firstValueFrom } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-angular22-features',
  imports: [FormField, FormRoot, JsonPipe, CodeHighlightComponent, CustomInputComponent],
  templateUrl: './angular22-features.html',
  styleUrl: './angular22-features.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Angular22Features implements OnInit {
  private readonly http = inject(HttpClient);

  // Active Tab Signal
  protected readonly activeTab = signal<'demo' | 'ts' | 'html'>('demo');

  // Writable signal as the primary source of truth for the newsletter form data
  protected readonly newsletterModel = signal({
    fullName: '',
    email: '',
    acceptTerms: false,
  });

  // Source code signals loaded via HTTP at runtime
  protected readonly tsCode = signal<string>('Chargement du code TypeScript...');
  protected readonly htmlCode = signal<string>('Chargement du code HTML...');

  // Setup the Signal Form with v22 validation rules and Declarative Submission API
  protected readonly newsletterForm = form(
    this.newsletterModel,
    (schemaPath) => {
      required(schemaPath.fullName, { message: 'Le nom complet est obligatoire' });
      required(schemaPath.email, { message: "L'adresse email est obligatoire" });
      email(schemaPath.email, { message: "Format d'adresse email invalide" });

      // Validation simple de la case à cocher
      required(schemaPath.acceptTerms, { message: 'Vous devez accepter les conditions' });
    },
    {
      submission: {
        action: (formInstance) => {
          // Simulation d'un appel réseau asynchrone de 1,5 seconde via un Observable RxJS converti en Promise
          return firstValueFrom(
            timer(1500).pipe(
              tap(() => {
                console.log('Inscription validée avec succès via Submission API & RxJS !', formInstance().value());
                alert(`Félicitations ${formInstance().value().fullName} ! Votre inscription à la newsletter a été enregistrée.`);
              }),
              map(() => undefined),
            ),
          );
        },
        onInvalid: (formInstance) => {
          console.warn("Tentative de soumission d'un formulaire invalide !", formInstance().errors);
        },
      },
    },
  );

  ngOnInit(): void {
    const errorMsg = (filename: string) =>
      `⚠️ Impossible de charger "${filename}".\n\n` +
      `💡 Note : La configuration "angular.json" a été modifiée pour copier automatiquement les sources.\n` +
      `👉 Si vous voyez ce message, veuillez ARRÊTER votre serveur de développement (Ctrl+C) et le RELANCER avec "ng serve" pour appliquer la nouvelle configuration.`;

    this.http.get('/source/angular22-features/angular22-features.ts', { responseType: 'text' }).subscribe({
      next: (code) => this.tsCode.set(code),
      error: () => this.tsCode.set(errorMsg('angular22-features.ts')),
    });

    this.http.get('/source/angular22-features/angular22-features.html', { responseType: 'text' }).subscribe({
      next: (code) => this.htmlCode.set(code),
      error: () => this.htmlCode.set(errorMsg('angular22-features.html')),
    });
  }
}
