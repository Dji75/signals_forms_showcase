import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';

@Component({
  selector: 'app-login',
  imports: [FormField, JsonPipe, CodeHighlightComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login implements OnInit {
  private readonly http = inject(HttpClient);

  // Navigation Tab Signal
  protected readonly activeTab = signal<'demo' | 'ts' | 'html'>('demo');

  // Writable signal as the primary source of truth for form data
  protected readonly loginModel = signal({
    email: '',
    password: '',
  });

  // Source code signals loaded via HTTP at runtime
  protected readonly tsCode = signal<string>('Chargement du code TypeScript...');
  protected readonly htmlCode = signal<string>('Chargement du code HTML...');

  ngOnInit(): void {
    const errorMsg = (filename: string) => 
      `⚠️ Impossible de charger "${filename}".\n\n` +
      `💡 Note : La configuration "angular.json" a été modifiée pour copier automatiquement les sources.\n` +
      `👉 Si vous voyez ce message, veuillez ARRÊTER votre serveur de développement (Ctrl+C) et le RELANCER avec "ng serve" pour appliquer la nouvelle configuration.`;

    this.http.get('/source/login/login.ts', { responseType: 'text' })
      .subscribe({
        next: code => this.tsCode.set(code),
        error: () => this.tsCode.set(errorMsg('login.ts'))
      });

    this.http.get('/source/login/login.html', { responseType: 'text' })
      .subscribe({
        next: code => this.htmlCode.set(code),
        error: () => this.htmlCode.set(errorMsg('login.html'))
      });
  }

  // Building the FieldTree based on the signal and specifying validation rules
  protected readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'L\'adresse email est obligatoire' });
    email(schemaPath.email, { message: 'Format d\'email invalide (ex: nom@domaine.com)' });

    required(schemaPath.password, { message: 'Le mot de passe est obligatoire' });
    minLength(schemaPath.password, 6, { message: 'Le mot de passe doit contenir au moins 6 caractères' });
  });

  // Derived state to track password strength reactively
  protected readonly passwordStrength = computed(() => {
    const password = this.loginForm.password().value();
    if (!password) return { label: 'Inexistant', class: 'text-gray', score: 0 };
    if (password.length < 6) return { label: 'Trop court', class: 'strength-weak', score: 1 };
    
    let score = 1;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Faible', class: 'strength-weak', score: 2 };
    if (score === 3) return { label: 'Moyen', class: 'strength-medium', score: 3 };
    return { label: 'Excellent', class: 'strength-strong', score: 4 };
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.loginForm().invalid()) {
      console.warn('Le formulaire est invalide');
      return;
    }

    console.log('Connexion réussie ! Données soumises :', this.loginModel());
    alert(`Bienvenue ! Vous êtes connecté en tant que : ${this.loginModel().email}`);
  }
}
