import { ChangeDetectionStrategy, Component, signal, inject, OnInit, effect, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';

@Component({
  selector: 'app-signals-untracked',
  imports: [CodeHighlightComponent],
  templateUrl: './signals-untracked.html',
  styleUrl: './signals-untracked.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsUntracked implements OnInit {
  private readonly http = inject(HttpClient);

  activeTab = signal<'demo' | 'ts' | 'html'>('demo');
  tsCode = signal<string>('Chargement...');
  htmlCode = signal<string>('Chargement...');

  // State
  countMain = signal<number>(0);
  countUntracked = signal<number>(0);
  untrackedLogs = signal<string[]>([]);

  constructor() {
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
    this.http.get('/source/signals-pitfalls/signals-untracked.ts', { responseType: 'text' })
      .subscribe({ next: code => this.tsCode.set(code), error: () => this.tsCode.set('Erreur de chargement') });
    this.http.get('/source/signals-pitfalls/signals-untracked.html', { responseType: 'text' })
      .subscribe({ next: code => this.htmlCode.set(code), error: () => this.htmlCode.set('Erreur de chargement') });
  }

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
