import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
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
export class SkillsArray {
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

  // Raw source codes for tabs
  tsCode = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, applyEach } from '@angular/forms/signals';

interface Skill { name: string; level: string; }
interface SkillsModel { developerName: string; skills: Skill[]; }

@Component({
  selector: 'app-skills-array',
  imports: [FormField],
  templateUrl: './skills-array.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsArray {
  skillsModel = signal<SkillsModel>({
    developerName: 'Ada Lovelace',
    skills: [
      { name: 'Angular', level: 'Expert' },
      { name: 'TypeScript', level: 'Intermédiaire' }
    ]
  });

  skillsForm = form(this.skillsModel, (schemaPath) => {
    required(schemaPath.developerName, { message: 'Nom du développeur requis' });

    // applyEach applies validation to each skill array item dynamically
    applyEach(schemaPath.skills, (skillPath) => {
      required(skillPath.name, { message: 'Nom requis' });
      required(skillPath.level, { message: 'Niveau requis' });
    });
  });

  addSkill() {
    this.skillsModel.update(c => ({
      ...current,
      skills: [...c.skills, { name: '', level: '' }]
    }));
  }

  removeSkill(index: number) {
    this.skillsModel.update(c => ({
      ...current,
      skills: c.skills.filter((_, i) => i !== index)
    }));
  }
}`;

  htmlCode = `<form (submit)="onSubmit($event)">
  <input type="text" [formField]="skillsForm.developerName" />

  <!-- Loop over dynamic list of fields inside FieldTree -->
  @for (skillField of skillsForm.skills; track skillField; let i = $index) {
    <div class="skill-card">
      <!-- Bind name field inside current item -->
      <input type="text" [formField]="skillField.name" />
      
      <!-- Bind level field inside current item -->
      <select [formField]="skillField.level">
        <option value="Débutant">Débutant</option>
        <option value="Intermédiaire">Intermédiaire</option>
        <option value="Expert">Expert</option>
      </select>

      <button type="button" (click)="removeSkill(i)">Supprimer</button>
    </div>
  }

  <button type="button" (click)="addSkill()">Ajouter une compétence</button>
</form>`;
}
