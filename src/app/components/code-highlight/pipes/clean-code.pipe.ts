import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanCode'
})
export class CleanCodePipe implements PipeTransform {
  transform(code: string, language: string): string {
    if (!code) return '';

    if (language === 'typescript') {
      let cleaned = code;

      // Clean simple patterns using a concise loop
      const patterns = [
        /import\s+[^;]*HttpClient[^;]*from\s+['"]@angular\/common\/http['"];?\r?\n?/g,
        /import\s+[^;]*CodeHighlightComponent[^;]*from\s+['"][^'"]+['"];?\r?\n?/g,
        /,?\s*CodeHighlightComponent/g,
        /\s*(?:\/\/[^\r\n]*\r?\n)?\s*(?:private|public|protected)?\s*(?:readonly)?\s*activeTab\s*=\s*signal(?:<[^>]*>)?\([^)]*\);?\r?\n?/g,
        /\s*(?:\/\/[^\r\n]*\r?\n)?\s*(?:private|public|protected)?\s*(?:readonly)?\s*tsCode\s*=\s*signal(?:<[^>]*>)?\([^)]*\);?\r?\n?/g,
        /\s*(?:\/\/[^\r\n]*\r?\n)?\s*(?:private|public|protected)?\s*(?:readonly)?\s*htmlCode\s*=\s*signal(?:<[^>]*>)?\([^)]*\);?\r?\n?/g,
        /\s*\/\/ Source code signals.*/g,
        /\bimplements\s+OnInit\b/g,
        /\s*(?:private|public|protected)?\s*(?:readonly)?\s*http\s*=\s*inject\s*\(\s*HttpClient\s*\)\s*;?/g,
      ];

      patterns.forEach(pattern => cleaned = cleaned.replace(pattern, ''));

      // Clean imports list inside @angular/core
      cleaned = cleaned
        .replace(/,\s*OnInit\b/g, '')
        .replace(/\bOnInit\s*,\s*/g, '')
        .replace(/,\s*inject\b/g, '')
        .replace(/\binject\s*,\s*/g, '')
        .replace(/,\s*,/g, ',')
        .replace(/\{\s*,\s*/g, '{ ')
        .replace(/,\s*\}\s*from/g, ' } from');

      // Remove ngOnInit method block
      cleaned = this.removeNgOnInit(cleaned);

      // Consolidate multiple consecutive blank lines into a single blank line
      cleaned = cleaned.replace(/\r?\n(?:\s*\r?\n){2,}/g, '\n\n');

      return cleaned.trim();
    }

    if (language === 'markup' || language === 'html') {
      let cleaned = this.extractDemoContent(code);
      
      // Consolidate multiple consecutive blank lines into a single blank line
      cleaned = cleaned.replace(/\r?\n(?:\s*\r?\n){2,}/g, '\n\n');

      return cleaned.trim();
    }

    return code;
  }

  private findClosingBrace(text: string, startIndex: number): number {
    let depth = 0;
    for (let i = startIndex; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  private removeNgOnInit(code: string): string {
    const start = code.search(/\bngOnInit\s*\(\s*\)/);
    if (start === -1) return code;
    
    const openBrace = code.indexOf('{', start);
    const closeBrace = this.findClosingBrace(code, openBrace);
    
    return closeBrace !== -1 
      ? code.substring(0, start) + code.substring(closeBrace + 1) 
      : code;
  }

  private extractDemoContent(html: string): string {
    const match = html.match(/@if\s*\(\s*activeTab\(\)\s*===\s*['"]demo['"]\s*\)\s*\{/);
    if (!match || match.index === undefined) return html;
    
    const openBrace = match.index + match[0].length - 1;
    const closeBrace = this.findClosingBrace(html, openBrace);
    
    if (closeBrace !== -1) {
      const extracted = html.substring(openBrace + 1, closeBrace);
      return this.unindent(extracted).trim();
    }
    
    return html;
  }

  private unindent(text: string): string {
    const lines = text.split('\n');
    const indents = lines
      .filter(line => line.trim().length > 0)
      .map(line => line.match(/^\s*/)?.[0].length ?? 0);
    
    const minIndent = Math.min(...indents);
    if (!minIndent || minIndent === Infinity) return text;
    
    return lines.map(line => line.substring(minIndent)).join('\n');
  }
}
