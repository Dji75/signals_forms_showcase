import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit, effect, untracked } from '@angular/core';
import { JsonPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';

interface UserProfile {
  name: string;
  age: number;
}

@Component({
  selector: 'app-signals-pitfalls',
  imports: [JsonPipe, CodeHighlightComponent],
  templateUrl: './signals-pitfalls.html',
  styleUrl: './signals-pitfalls.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsPitfalls implements OnInit {
  private readonly http = inject(HttpClient);

  // Tabs for showcase layout
  activeTab = signal<'demo' | 'ts' | 'html'>('demo');

  // Source codes loaded dynamically
  tsCode = signal<string>('Chargement du code TypeScript...');
  htmlCode = signal<string>('Chargement du code HTML...');

  // --- Pitfall 1: Async Dependency Tracking ---
  valSync = signal<number>(0);
  valAsync = signal<number>(0);
  asyncLogs = signal<string[]>([]);

  // --- Pitfall 2: Reference Mutation ---
  userObj = signal<UserProfile>({ name: 'Jean Dupont', age: 28 });
  
  // Computed tracking userObj
  userDescription = computed(() => {
    const user = this.userObj();
    const now = new Date().toLocaleTimeString();
    return `👤 ${user.name} - ${user.age} ans (Mise à jour calculée à ${now})`;
  });

  // --- Pitfall 3: Untracked Reading ---
  countMain = signal<number>(0);
  countUntracked = signal<number>(0);
  untrackedLogs = signal<string[]>([]);

  constructor() {
    // Pitfall 1 Effect demonstration
    effect(() => {
      // 1. Synchrone : Angular enregistre "this.valSync" comme dépendance
      const s = this.valSync();
      this.asyncLogs.update(logs => [...logs, `[Sync Read] valSync = ${s}`]);

      // 2. Asynchrone : setTimeout crée une frontière asynchrone
      setTimeout(() => {
        // Cette lecture n'est PAS enregistrée comme dépendance par Angular !
        const a = this.valAsync();
        this.asyncLogs.update(logs => [
          ...logs, 
          `[Async Read (non suivi)] valAsync = ${a} (Exécuté suite au changement de valSync)`
        ]);
      }, 300);
    });

    // Pitfall 3 Effect demonstration
    effect(() => {
      const main = this.countMain();
      // On lit countUntracked de manière non suivie
      const extra = untracked(() => this.countUntracked());

      this.untrackedLogs.update(logs => [
        ...logs,
        `[Effect Count] Exécuté ! Main = ${main} | Untracked = ${extra} (à ${new Date().toLocaleTimeString()})`
      ]);
    });
  }

  ngOnInit() {
    const errorMsg = (filename: string) => 
      `⚠️ Impossible de charger "${filename}".\n\n` +
      `💡 Note : Relancer avec "ng serve" si besoin pour copier les sources.`;

    this.http.get('/source/signals-pitfalls/signals-pitfalls.ts', { responseType: 'text' })
      .subscribe({
        next: code => this.tsCode.set(code),
        error: () => this.tsCode.set(errorMsg('signals-pitfalls.ts'))
      });

    this.http.get('/source/signals-pitfalls/signals-pitfalls.html', { responseType: 'text' })
      .subscribe({
        next: code => this.htmlCode.set(code),
        error: () => this.htmlCode.set(errorMsg('signals-pitfalls.html'))
      });
  }

  // --- Actions Pitfall 1 ---
  incrementSync() {
    this.valSync.update(n => n + 1);
  }

  incrementAsync() {
    this.valAsync.update(n => n + 1);
  }

  clearAsyncLogs() {
    this.asyncLogs.set([]);
  }

  // --- Actions Pitfall 2 ---
  mutateDirectlyKO() {
    // On modifie l'objet interne en place (mutation directe)
    const current = this.userObj();
    current.age += 1;
    
    // Même si on fait un set() avec la même référence, Angular n'émet rien
    // car old_value === new_value (la référence de l'objet est identique).
    this.userObj.set(current);
  }

  updateCorrectlyOK() {
    // On retourne une NOUVELLE référence d'objet via l'opérateur spread (...)
    this.userObj.update(u => ({
      ...u,
      age: u.age + 1
    }));
  }

  resetUser() {
    this.userObj.set({ name: 'Jean Dupont', age: 28 });
  }

  // --- Actions Pitfall 3 ---
  incrementMain() {
    this.countMain.update(n => n + 1);
  }

  incrementUntracked() {
    this.countUntracked.update(n => n + 1);
  }

  clearUntrackedLogs() {
    this.untrackedLogs.set([]);
  }
}
