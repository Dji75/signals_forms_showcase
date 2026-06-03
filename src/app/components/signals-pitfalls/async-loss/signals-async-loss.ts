import { ChangeDetectionStrategy, Component, signal, inject, OnInit, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CodeHighlightComponent } from '../../code-highlight/code-highlight';

@Component({
  selector: 'app-signals-async-loss',
  imports: [CodeHighlightComponent],
  templateUrl: './signals-async-loss.html',
  styleUrl: './signals-async-loss.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignalsAsyncLoss implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly activeTab = signal<'demo' | 'ts' | 'html'>('demo');
  protected readonly tsCode = signal<string>('Chargement...');
  protected readonly htmlCode = signal<string>('Chargement...');

  // State
  protected readonly valSync = signal<number>(0);
  protected readonly valAsync = signal<number>(0);
  protected readonly asyncLogs = signal<string[]>([]);

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

  ngOnInit(): void {
    this.http.get('/source/signals-pitfalls/async-loss/signals-async-loss.ts', { responseType: 'text' })
      .subscribe({ next: code => this.tsCode.set(code), error: () => this.tsCode.set('Erreur de chargement') });
    this.http.get('/source/signals-pitfalls/async-loss/signals-async-loss.html', { responseType: 'text' })
      .subscribe({ next: code => this.htmlCode.set(code), error: () => this.htmlCode.set('Erreur de chargement') });
  }

  protected incrementSync(): void {
    this.valSync.update(n => n + 1);
  }

  protected incrementAsync(): void {
    this.valAsync.update(n => n + 1);
  }

  protected clearAsyncLogs(): void {
    this.asyncLogs.set([]);
  }
}
