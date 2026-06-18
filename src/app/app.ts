import { Component, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly platformId = inject(PLATFORM_ID);

  // Global writable signal for the active Prism syntax highlighting theme
  protected readonly selectedTheme = signal<string>('prism-tomorrow');

  constructor() {
    // 1. On startup, load any saved theme from browser's sessionStorage
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = sessionStorage.getItem('syntax-highlight-theme');
      if (savedTheme) {
        this.selectedTheme.set(savedTheme);
      }
    }

    // 2. Reactive effect that changes head <link> and saves choice to sessionStorage on change
    effect(() => {
      const theme = this.selectedTheme();
      if (isPlatformBrowser(this.platformId)) {
        // Update DOM stylesheet
        const themeLink = document.getElementById('prism-theme-link') as HTMLLinkElement;
        if (themeLink) {
          themeLink.href = `themes/${theme}.css`;
        }
        // Persist theme selection
        sessionStorage.setItem('syntax-highlight-theme', theme);
      }
    });
  }

  // Event handler for dropdown updates
  protected onThemeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select) {
      this.selectedTheme.set(select.value);
    }
  }
}
