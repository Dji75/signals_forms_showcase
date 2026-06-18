import { ChangeDetectionStrategy, Component, signal, inject, OnInit, effect, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CodeHighlightComponent } from '../../code-highlight/code-highlight';

@Component({
  selector: 'app-signals-untracked',
  imports: [CodeHighlightComponent],
  templateUrl: './signals-untracked.html',
  styleUrl: './signals-untracked.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignalsUntracked implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly activeTab = signal<'demo' | 'ts' | 'html'>('demo');
  protected readonly tsCode = signal<string>('Chargement...');
  protected readonly htmlCode = signal<string>('Chargement...');

  // State
  protected readonly countMain = signal<number>(0);
  protected readonly countUntracked = signal<number>(0);
  protected readonly untrackedLogs = signal<string[]>([]);

  constructor() {
    effect(() => {
      const main = this.countMain();
      const extra = untracked(() => this.countUntracked());

      this.untrackedLogs.update((logs) => [
        ...logs,
        `[Effect Count] Exécuté ! Main = ${main} | Untracked = ${extra} (à ${new Date().toLocaleTimeString()})`,
      ]);
    });
  }

  ngOnInit(): void {
    this.http
      .get('/source/signals-pitfalls/untracked/signals-untracked.ts', { responseType: 'text' })
      .subscribe({ next: (code) => this.tsCode.set(code), error: () => this.tsCode.set('Erreur de chargement') });
    this.http
      .get('/source/signals-pitfalls/untracked/signals-untracked.html', { responseType: 'text' })
      .subscribe({ next: (code) => this.htmlCode.set(code), error: () => this.htmlCode.set('Erreur de chargement') });
  }

  protected incrementMain(): void {
    this.countMain.update((n) => n + 1);
  }

  protected incrementUntracked(): void {
    this.countUntracked.update((n) => n + 1);
  }

  protected clearUntrackedLogs(): void {
    this.untrackedLogs.set([]);
  }
}
