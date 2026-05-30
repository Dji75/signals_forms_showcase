import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { form, FormField, required, applyEach } from '@angular/forms/signals';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';

interface Skill {
  name: string;
  level: string;
}

interface SkillsModel {
  developerName: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills-array',
  imports: [FormField, JsonPipe, CodeHighlightComponent],
  templateUrl: './skills-array.html',
  styleUrl: './skills-array.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsArray implements OnInit {
  private http = inject(HttpClient);

  // Navigation Tab Signal
  activeTab = signal<'demo' | 'ts' | 'html'>('demo');

  // Writable signal as the single source of truth, pre-filled with items
  skillsModel = signal<SkillsModel>({
    developerName: 'Ada Lovelace',
    skills: [
      { name: 'Angular', level: 'Expert' },
      { name: 'TypeScript', level: 'Intermédiaire' },
    ],
  });

  // Source code signals loaded via HTTP at runtime
  tsCode = signal<string>('Chargement du code TypeScript...');
  htmlCode = signal<string>('Chargement du code HTML...');

  ngOnInit() {
    const errorMsg = (filename: string) => 
      `⚠️ Impossible de charger "${filename}".\n\n` +
      `💡 Note : La configuration "angular.json" a été modifiée pour copier automatiquement les sources.\n` +
      `👉 Si vous voyez ce message, veuillez ARRÊTER votre serveur de développement (Ctrl+C) et le RELANCER avec "ng serve" pour appliquer la nouvelle configuration.`;

    this.http.get('/source/skills-array/skills-array.ts', { responseType: 'text' })
      .subscribe({
        next: code => this.tsCode.set(code),
        error: () => this.tsCode.set(errorMsg('skills-array.ts'))
      });

    this.http.get('/source/skills-array/skills-array.html', { responseType: 'text' })
      .subscribe({
        next: code => this.htmlCode.set(code),
        error: () => this.htmlCode.set(errorMsg('skills-array.html'))
      });
  }

  // Defining form and validation schema for arrays using applyEach()
  skillsForm = form(this.skillsModel, (schemaPath) => {
    required(schemaPath.developerName, { message: 'Le nom du développeur est requis' });

    // Apply validation to each element of the skills array
    applyEach(schemaPath.skills, (skillPath) => {
      required(skillPath.name, { message: 'Le nom de la compétence est obligatoire' });
      required(skillPath.level, { message: 'Veuillez sélectionner un niveau' });
    });
  });

  // Programmatically append an item to the array
  addSkill() {
    this.skillsModel.update((current) => ({
      ...current,
      skills: [...current.skills, { name: '', level: '' }],
    }));
  }

  // Programmatically remove an item from the array by its index
  removeSkill(index: number) {
    this.skillsModel.update((current) => ({
      ...current,
      skills: current.skills.filter((_, i) => i !== index),
    }));
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.skillsForm().invalid()) {
      console.warn('Formulaire compétences invalide');
      return;
    }
    console.log('Données compétences sauvegardées :', this.skillsModel());
    alert(`Compétences sauvegardées pour ${this.skillsModel().developerName} !`);
  }
}
