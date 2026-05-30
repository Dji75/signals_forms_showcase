import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { form, FormField, required, hidden, disabled, readonly } from '@angular/forms/signals';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';

interface ProfileModel {
  userId: string;
  username: string;
  email: string;
  isPublic: boolean;
  publicUrl: string;
  lockProfile: boolean;
  address: {
    street: string;
    city: string;
  };
  requiresBackupAddress: boolean;
  backupAddress: {
    street: string;
    city: string;
  };
}

@Component({
  selector: 'app-profile',
  imports: [FormField, JsonPipe, CodeHighlightComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  private http = inject(HttpClient);

  // Navigation Tab Signal
  activeTab = signal<'demo' | 'ts' | 'html'>('demo');

  // Writable signal holding the complete nested form structure
  profileModel = signal<ProfileModel>({
    userId: 'USER-98214',
    username: 'dev_signals',
    email: 'contact@signals.dev',
    isPublic: false,
    publicUrl: '',
    lockProfile: false,
    address: {
      street: '12 Rue des Signaux',
      city: 'Paris',
    },
    requiresBackupAddress: false,
    backupAddress: {
      street: '',
      city: '',
    },
  });

  // Source code signals loaded via HTTP at runtime
  tsCode = signal<string>('Chargement du code TypeScript...');
  htmlCode = signal<string>('Chargement du code HTML...');

  ngOnInit() {
    const errorMsg = (filename: string) => 
      `⚠️ Impossible de charger "${filename}".\n\n` +
      `💡 Note : La configuration "angular.json" a été modifiée pour copier automatiquement les sources.\n` +
      `👉 Si vous voyez ce message, veuillez ARRÊTER votre serveur de développement (Ctrl+C) et le RELANCER avec "ng serve" pour appliquer la nouvelle configuration.`;

    this.http.get('/source/profile/profile.ts', { responseType: 'text' })
      .subscribe({
        next: code => this.tsCode.set(code),
        error: () => this.tsCode.set(errorMsg('profile.ts'))
      });

    this.http.get('/source/profile/profile.html', { responseType: 'text' })
      .subscribe({
        next: code => this.htmlCode.set(code),
        error: () => this.htmlCode.set(errorMsg('profile.html'))
      });
  }

  // Defining the form tree with conditional availability rules
  profileForm = form(this.profileModel, (schemaPath) => {
    // 1. Static Readonly Rule - Field is visible but cannot be modified
    readonly(schemaPath.userId);

    // 2. Main field validations
    required(schemaPath.username, { message: 'Le nom d\'utilisateur est requis' });
    required(schemaPath.email, { message: 'L\'adresse email est requise' });

    // 3. Conditional Disabled Rule - Fields are disabled when "lockProfile" is true
    disabled(schemaPath.username, ({ valueOf }) => valueOf(schemaPath.lockProfile));
    disabled(schemaPath.email, ({ valueOf }) => valueOf(schemaPath.lockProfile));

    // 4. Conditional Hidden Rule - publicUrl is only relevant when isPublic is true
    hidden(schemaPath.publicUrl, ({ valueOf }) => !valueOf(schemaPath.isPublic));
    // Validation on publicUrl only runs if the field is visible (hidden fields do not block validation!)
    required(schemaPath.publicUrl, { message: 'L\'URL publique est requise' });

    // 5. Nested object validations
    required(schemaPath.address.street, { message: 'La rue principale est obligatoire' });
    required(schemaPath.address.city, { message: 'La ville principale est obligatoire' });

    // 6. Dynamic nested hidden rule for Backup Address
    hidden(schemaPath.backupAddress.street, ({ valueOf }) => !valueOf(schemaPath.requiresBackupAddress));
    hidden(schemaPath.backupAddress.city, ({ valueOf }) => !valueOf(schemaPath.requiresBackupAddress));

    required(schemaPath.backupAddress.street, { message: 'La rue de secours est obligatoire' });
    required(schemaPath.backupAddress.city, { message: 'La ville de secours est obligatoire' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.profileForm().invalid()) {
      console.warn('Formulaire profil invalide');
      return;
    }
    console.log('Profil mis à jour avec succès !', this.profileModel());
    alert('Profil sauvegardé !');
  }
}
