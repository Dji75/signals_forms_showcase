import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [FormField, JsonPipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  // Writable signal as the primary source of truth for form data
  loginModel = signal({
    email: '',
    password: '',
  });

  // Building the FieldTree based on the signal and specifying validation rules
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'L\'adresse email est obligatoire' });
    email(schemaPath.email, { message: 'Format d\'email invalide (ex: nom@domaine.com)' });

    required(schemaPath.password, { message: 'Le mot de passe est obligatoire' });
    minLength(schemaPath.password, 6, { message: 'Le mot de passe doit contenir au moins 6 caractères' });
  });

  // Derived state to track password strength reactively
  passwordStrength = computed(() => {
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

  onSubmit(event: Event) {
    event.preventDefault();
    
    if (this.loginForm().invalid()) {
      console.warn('Le formulaire est invalide');
      return;
    }

    console.log('Connexion réussie ! Données soumises :', this.loginModel());
    alert(`Bienvenue ! Vous êtes connecté en tant que : ${this.loginModel().email}`);
  }
}
