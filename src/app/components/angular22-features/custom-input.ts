import { Component, model, ChangeDetectionStrategy } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-custom-input',
  template: `
    <div class="custom-input-wrapper">
      <input
        [value]="value()"
        (input)="value.set($any($event.target).value)"
        class="custom-input-field"
        placeholder="Saisissez votre nom..."
      />
      <div class="custom-badge">FormValueControl (RIP CVA)</div>
    </div>
  `,
  styles: [
    `
      .custom-input-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .custom-input-field {
        border: 2px dashed #3b82f6 !important;
        background-color: #f0f9ff !important;
        padding: 0.75rem !important;
        border-radius: var(--border-radius, 8px) !important;
        width: 100%;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s;
      }
      .custom-input-field:focus {
        border-color: #1d4ed8 !important;
        background-color: #e0f2fe !important;
      }
      .custom-badge {
        font-size: 0.7rem;
        color: #3b82f6;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent implements FormValueControl<string> {
  readonly value = model<string>('');
}
