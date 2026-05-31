import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';

interface UserProfile {
  name: string;
  age: number;
}

@Component({
  selector: 'app-signals-reference-mutation',
  imports: [JsonPipe, CodeHighlightComponent],
  templateUrl: './signals-reference-mutation.html',
  styleUrl: './signals-reference-mutation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsReferenceMutation implements OnInit {
  private readonly http = inject(HttpClient);

  activeTab = signal<'demo' | 'ts' | 'html'>('demo');
  tsCode = signal<string>('Chargement...');
  htmlCode = signal<string>('Chargement...');

  // State
  userObj = signal<UserProfile>({ name: 'Jean Dupont', age: 28 });
  
  // Computed tracking userObj
  userDescription = computed(() => {
    const user = this.userObj();
    const now = new Date().toLocaleTimeString();
    return `👤 ${user.name} - ${user.age} ans (Mise à jour calculée à ${now})`;
  });

  ngOnInit() {
    this.http.get('/source/signals-pitfalls/signals-reference-mutation.ts', { responseType: 'text' })
      .subscribe({ next: code => this.tsCode.set(code), error: () => this.tsCode.set('Erreur de chargement') });
    this.http.get('/source/signals-pitfalls/signals-reference-mutation.html', { responseType: 'text' })
      .subscribe({ next: code => this.htmlCode.set(code), error: () => this.htmlCode.set('Erreur de chargement') });
  }

  mutateDirectlyKO() {
    const current = this.userObj();
    current.age += 1;
    this.userObj.set(current);
  }

  updateCorrectlyOK() {
    this.userObj.update(u => ({
      ...u,
      age: u.age + 1
    }));
  }

  resetUser() {
    this.userObj.set({ name: 'Jean Dupont', age: 28 });
  }
}
