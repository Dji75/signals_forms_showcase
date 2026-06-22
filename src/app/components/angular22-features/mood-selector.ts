import { Component, model, ChangeDetectionStrategy } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

export type MoodType = 'sad' | 'neutral' | 'happy' | 'love';

interface MoodOption {
  value: MoodType;
  emoji: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-mood-selector',
  standalone: true,
  templateUrl: './mood-selector.html',
  styleUrl: './mood-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoodSelectorComponent implements FormValueControl<MoodType> {
  // Model signal required by FormValueControl interface
  readonly value = model<MoodType>('happy');

  protected readonly options: MoodOption[] = [
    { value: 'sad', emoji: '😭', label: 'Déçu', color: '#ef4444' },
    { value: 'neutral', emoji: '😐', label: 'Neutre', color: '#94a3b8' },
    { value: 'happy', emoji: '🙂', label: 'Satisfait', color: '#10b981' },
    { value: 'love', emoji: '😍', label: 'Ravi', color: '#ec4899' },
  ];

  protected onKeyDown(event: KeyboardEvent): void {
    const currentIdx = this.options.findIndex((opt) => opt.value === this.value());
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        const nextIdx = (currentIdx + 1) % this.options.length;
        this.value.set(this.options[nextIdx].value);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        const prevIdx = (currentIdx - 1 + this.options.length) % this.options.length;
        this.value.set(this.options[prevIdx].value);
        break;
    }
  }
}
