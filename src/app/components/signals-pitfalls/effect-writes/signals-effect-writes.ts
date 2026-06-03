import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CodeHighlightComponent } from '../../code-highlight/code-highlight';

@Component({
  selector: 'app-signals-effect-writes',
  imports: [CodeHighlightComponent],
  templateUrl: './signals-effect-writes.html',
  styleUrl: './signals-effect-writes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignalsEffectWrites implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly activeTab = signal<'demo' | 'ts' | 'html'>('demo');
  protected readonly tsCode = signal<string>('Chargement...');
  protected readonly htmlCode = signal<string>('Chargement...');

  ngOnInit(): void {
    this.http.get('/source/signals-pitfalls/effect-writes/signals-effect-writes.ts', { responseType: 'text' })
      .subscribe({ next: code => this.tsCode.set(code), error: () => this.tsCode.set('Erreur de chargement') });
    this.http.get('/source/signals-pitfalls/effect-writes/signals-effect-writes.html', { responseType: 'text' })
      .subscribe({ next: code => this.htmlCode.set(code), error: () => this.htmlCode.set('Erreur de chargement') });
  }
}
