import { Component, model, ChangeDetectionStrategy, signal, HostListener, HostBinding } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent implements FormValueControl<number> {
  // Required model signal from FormValueControl interface
  readonly value = model<number>(0);

  // Local state for star hover previews
  protected readonly hoverValue = signal<number | null>(null);

  protected readonly stars = [1, 2, 3, 4, 5];

  protected isStarred(star: number): boolean {
    const current = this.hoverValue() ?? this.value() ?? 0;
    return star <= current;
  }

  protected selectRating(rating: number): void {
    this.value.set(rating);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const current = this.value() ?? 0;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        if (current < 5) this.value.set(current + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        if (current > 0) this.value.set(current - 1);
        break;
      case 'Home':
        event.preventDefault();
        this.value.set(0);
        break;
      case 'End':
        event.preventDefault();
        this.value.set(5);
        break;
    }
  }
}
