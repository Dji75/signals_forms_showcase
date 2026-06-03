import { 
  Component, 
  ElementRef, 
  ViewChild, 
  Inject, 
  PLATFORM_ID,
  input,
  effect
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CleanCodePipe } from './pipes/clean-code.pipe';

// Import PrismJS core
import * as Prism from 'prismjs';

// Import the specific languages we want to support
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup'; // Markup supports HTML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';

@Component({
  selector: 'app-code-highlight',
  imports: [CleanCodePipe],
  template: `
    <pre [class]="'language-' + language()"><code #codeElement [class]="'language-' + language()">{{ code() | cleanCode:language() }}</code></pre>
  `,
  styles: [`
    pre {
      margin: 0;
      padding: 1.5rem !important;
      border-radius: 8px !important;
      overflow: auto;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 0.88rem;
      line-height: 1.5;
      background-color: #0f172a !important; /* Tomorrow dark slate */
      border: 1px solid #1e293b;
      max-height: 600px;
    }
    code {
      font-family: inherit;
      background: none !important;
      text-shadow: none !important;
    }
  `]
})
export class CodeHighlightComponent {
  // Signal inputs for reactive re-evaluation
  code = input.required<string>();
  language = input<string>('typescript');

  @ViewChild('codeElement') codeElement!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Automatically re-apply Prism rendering when inputs change
    effect(() => {
      // Register signals dependencies
      this.code();
      this.language();

      if (isPlatformBrowser(this.platformId)) {
        // Wait for Angular DOM rendering to finish
        setTimeout(() => {
          if (this.codeElement?.nativeElement) {
            Prism.highlightElement(this.codeElement.nativeElement);
          }
        }, 0);
      }
    });
  }
}
