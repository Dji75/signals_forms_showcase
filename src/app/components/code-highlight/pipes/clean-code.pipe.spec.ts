import { describe, it, expect, beforeEach } from 'vitest';
import { CleanCodePipe } from './clean-code.pipe';

describe('CleanCodePipe', () => {
  let pipe: CleanCodePipe;

  beforeEach(() => {
    pipe = new CleanCodePipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  describe('TypeScript Code Cleaning', () => {
    it('should remove HttpClient imports and private injection', () => {
      const input = `
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class MyComp {
  private http = inject(HttpClient);
}
      `;
      const result = pipe.transform(input, 'typescript');
      expect(result).not.toContain('HttpClient');
      expect(result).not.toContain('private http = inject(HttpClient);');
    });

    it('should remove OnInit and inject from @angular/core import', () => {
      const input = `
import { Component, OnInit, signal, inject } from '@angular/core';
      `;
      const result = pipe.transform(input, 'typescript');
      expect(result).toContain('Component');
      expect(result).toContain('signal');
      expect(result).not.toContain('OnInit');
      expect(result).not.toContain('inject');
    });

    it('should remove activeTab, tsCode, and htmlCode signals', () => {
      const input = `
export class MyComp {
  activeTab = signal<'demo' | 'ts' | 'html'>('demo');
  tsCode = signal<string>('Chargement...');
  htmlCode = signal<string>('Chargement...');
}
      `;
      const result = pipe.transform(input, 'typescript');
      expect(result).not.toContain('activeTab');
      expect(result).not.toContain('tsCode');
      expect(result).not.toContain('htmlCode');
    });

    it('should remove implements OnInit and ngOnInit() block', () => {
      const input = `
export class MyComp implements OnInit {
  ngOnInit() {
    this.http.get('/source').subscribe({
      next: code => this.tsCode.set(code)
    });
  }
}
      `;
      const result = pipe.transform(input, 'typescript');
      expect(result).not.toContain('implements OnInit');
      expect(result).not.toContain('ngOnInit');
    });
  });

  describe('HTML Code Cleaning', () => {
    it('should extract content from @if (activeTab() === "demo") block and unindent', () => {
      const input = `
<div class="showcase-card">
  @if (activeTab() === 'demo') {
    <form>
      <input type="text" />
    </form>
  }
</div>
      `;
      const result = pipe.transform(input, 'markup');
      expect(result).not.toContain('showcase-card');
      expect(result).not.toContain("@if (activeTab() === 'demo')");
      // Checked that indent has been reduced correctly
      expect(result).toBe('<form>\n  <input type="text" />\n</form>');
    });
  });
});
