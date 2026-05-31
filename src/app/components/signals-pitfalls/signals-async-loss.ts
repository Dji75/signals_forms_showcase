import { ChangeDetectionStrategy, Component, signal, inject, OnInit, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';

@Component({
  selector: 'app-signals-async-loss',
  imports: [CodeHighlightComponent],
  templateUrl: './signals-async-loss.html',
  styleUrl: './signals-async-loss.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsAsyncLoss implements OnInit {
  private readonly http = inject(HttpClient);

  activeTab = signal<'demo' | 'ts' | 'html'>('demo');
  tsCode = signal<string>('Chargement...');
  htmlCode = signal<string>('Chargement...');

  // State
  valSync = signal<number>(0);
  valAsync = signal<number>(0);
  asyncLogs = signal<string[]>([]);

  constructor() {
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
  }

  ngOnInit() {
    this.http.get('/source/signals-pitfalls/signals-async-loss.ts', { responseType: 'text' })
      .subscribe({ next: code => this.tsCode.set(code), error: () => this.tsCode.set('Erreur de chargement') });
    this.http.get('/source/signals-pitfalls/signals-async-loss.html', { responseType: 'text' })
      .subscribe({ next: code => this.htmlCode.set(code), error: () => this.htmlCode.set('Erreur de chargement') });
  }

  incrementSync() {
    this.valSync.update(n => n + 1);
  }

  incrementAsync() {
    this.valAsync.update(n => n + 1);
  }

  clearAsyncLogs() {
    this.asyncLogs.set([]);
  }
}
