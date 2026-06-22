import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';
import { StarRatingComponent } from './star-rating';
import { MoodSelectorComponent, MoodType } from './mood-selector';
import { timer, firstValueFrom } from 'rxjs';
import { tap, map } from 'rxjs/operators';

interface FeedbackModel {
  mood: MoodType;
  stars: number;
  comment: string;
}

@Component({
  selector: 'app-form-value-control-demo',
  standalone: true,
  imports: [FormField, FormRoot, JsonPipe, CodeHighlightComponent, StarRatingComponent, MoodSelectorComponent],
  templateUrl: './form-value-control-demo.html',
  styleUrl: './form-value-control-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormValueControlDemo implements OnInit {
  private readonly http = inject(HttpClient);

  // Active Tab Signal
  protected readonly activeTab = signal<'demo' | 'starsTs' | 'starsHtml' | 'moodTs' | 'moodHtml'>('demo');

  // Writable signal as the primary source of truth for the feedback form data
  protected readonly feedbackModel = signal<FeedbackModel>({
    mood: 'happy',
    stars: 4,
    comment: '',
  });

  // Source code signals loaded via HTTP at runtime
  protected readonly starsTsCode = signal<string>('Chargement du code...');
  protected readonly starsHtmlCode = signal<string>('Chargement du code...');
  protected readonly moodTsCode = signal<string>('Chargement du code...');
  protected readonly moodHtmlCode = signal<string>('Chargement du code...');

  // Setup the Signal Form with v22 validation rules and Declarative Submission API
  protected readonly feedbackForm = form(
    this.feedbackModel,
    (schemaPath) => {
      required(schemaPath.stars, { message: "Le nombre d'étoiles est requis" });
      required(schemaPath.comment, { message: 'Un commentaire est obligatoire' });
    },
    {
      submission: {
        action: (formInstance) => {
          // Simulate an async network call
          return firstValueFrom(
            timer(1500).pipe(
              tap(() => {
                console.log('Feedback envoyé avec succès !', formInstance().value());
                alert(`Merci pour votre retour ! Humeur: ${formInstance().value().mood}, Étoiles: ${formInstance().value().stars}/5.`);
              }),
              map(() => undefined),
            ),
          );
        },
        onInvalid: (formInstance) => {
          console.warn('Formulaire invalide !', formInstance().errors);
        },
      },
    },
  );

  ngOnInit(): void {
    const errorMsg = (filename: string) =>
      `⚠️ Impossible de charger "${filename}".\n\n` +
      `💡 Note : Si vous venez de créer ce fichier, relancez "ng serve" pour qu'il soit copié.`;

    this.http.get('/source/angular22-features/star-rating.ts', { responseType: 'text' }).subscribe({
      next: (code) => this.starsTsCode.set(code),
      error: () => this.starsTsCode.set(errorMsg('star-rating.ts')),
    });

    this.http.get('/source/angular22-features/star-rating.html', { responseType: 'text' }).subscribe({
      next: (code) => this.starsHtmlCode.set(code),
      error: () => this.starsHtmlCode.set(errorMsg('star-rating.html')),
    });

    this.http.get('/source/angular22-features/mood-selector.ts', { responseType: 'text' }).subscribe({
      next: (code) => this.moodTsCode.set(code),
      error: () => this.moodTsCode.set(errorMsg('mood-selector.ts')),
    });

    this.http.get('/source/angular22-features/mood-selector.html', { responseType: 'text' }).subscribe({
      next: (code) => this.moodHtmlCode.set(code),
      error: () => this.moodHtmlCode.set(errorMsg('mood-selector.html')),
    });
  }
}
