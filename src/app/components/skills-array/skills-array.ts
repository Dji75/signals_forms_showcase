import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, applyEach } from '@angular/forms/signals';

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
  imports: [FormField, JsonPipe],
  templateUrl: './skills-array.html',
  styleUrl: './skills-array.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsArray {
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
}
