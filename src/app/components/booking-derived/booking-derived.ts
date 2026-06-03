import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { JsonPipe, UpperCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { form, FormField, required, min, max, validate } from '@angular/forms/signals';
import { CodeHighlightComponent } from '../code-highlight/code-highlight';

interface BookingModel {
  ticketType: string;
  quantity: number;
  couponCode: string;
}

@Component({
  selector: 'app-booking-derived',
  imports: [FormField, JsonPipe, UpperCasePipe, CodeHighlightComponent],
  templateUrl: './booking-derived.html',
  styleUrl: './booking-derived.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BookingDerived implements OnInit {
  private readonly http = inject(HttpClient);

  // Navigation Tab Signal
  protected readonly activeTab = signal<'demo' | 'ts' | 'html'>('demo');

  // Model signal
  protected readonly bookingModel = signal<BookingModel>({
    ticketType: 'standard',
    quantity: 1,
    couponCode: '',
  });

  // Source code signals loaded via HTTP at runtime
  protected readonly tsCode = signal<string>('Chargement du code TypeScript...');
  protected readonly htmlCode = signal<string>('Chargement du code HTML...');

  ngOnInit(): void {
    const errorMsg = (filename: string) => 
      `⚠️ Impossible de charger "${filename}".\n\n` +
      `💡 Note : La configuration "angular.json" a été modifiée pour copier automatiquement les sources.\n` +
      `👉 Si vous voyez ce message, veuillez ARRÊTER votre serveur de développement (Ctrl+C) et le RELANCER avec "ng serve" pour appliquer la nouvelle configuration.`;

    this.http.get('/source/booking-derived/booking-derived.ts', { responseType: 'text' })
      .subscribe({
        next: code => this.tsCode.set(code),
        error: () => this.tsCode.set(errorMsg('booking-derived.ts'))
      });

    this.http.get('/source/booking-derived/booking-derived.html', { responseType: 'text' })
      .subscribe({
        next: code => this.htmlCode.set(code),
        error: () => this.htmlCode.set(errorMsg('booking-derived.html'))
      });
  }

  // Defining validation rules with cross-field validator
  protected readonly bookingForm = form(this.bookingModel, (schemaPath) => {
    required(schemaPath.ticketType, { message: 'Veuillez sélectionner un type de billet' });
    required(schemaPath.quantity, { message: 'La quantité est obligatoire' });
    
    // Standard validation limits
    min(schemaPath.quantity, 1, { message: 'La quantité minimale est de 1' });
    max(schemaPath.quantity, 10, { message: 'La quantité maximale autorisée est de 10' });

    // Custom Cross-Field Validator: VIP Quantity Limit
    // This validator automatically re-evaluates whenever ticketType OR quantity changes!
    validate(schemaPath.quantity, ({ value, valueOf }) => {
      const type = valueOf(schemaPath.ticketType);
      const qty = value();
      
      if (type === 'vip' && qty > 4) {
        return {
          kind: 'vipLimitExceeded',
          message: 'Les billets VIP sont hautement limités. Maximum 4 billets par réservation !',
        };
      }
      return null;
    });

    // Custom Validator: Valid Coupon Check
    validate(schemaPath.couponCode, ({ value }) => {
      const coupon = value().trim().toUpperCase();
      if (coupon && coupon !== 'REDUC20' && coupon !== 'OFFRE50' && coupon !== 'GRATUIT') {
        return {
          kind: 'invalidCoupon',
          message: 'Code promo invalide (codes valides: REDUC20, OFFRE50, GRATUIT)',
        };
      }
      return null;
    });
  });

  // Derived Price Calculations via computed() signals (fully reactive!)
  private readonly ticketPrices: Record<string, number> = {
    standard: 25,
    vip: 75,
    student: 15,
  };

  // Base price derived from selected ticketType and quantity
  protected readonly basePrice = computed(() => {
    const type = this.bookingForm.ticketType().value();
    const qty = this.bookingForm.quantity().value();
    const unitPrice = this.ticketPrices[type] || 0;
    return unitPrice * qty;
  });

  // Discount percentage derived from couponCode validation and value
  protected readonly discount = computed(() => {
    const coupon = this.bookingForm.couponCode().value().trim().toUpperCase();
    const hasError = this.bookingForm.couponCode().invalid();
    
    if (!coupon || hasError) return { rate: 0, label: '0%' };
    if (coupon === 'REDUC20') return { rate: 0.2, label: '20%' };
    if (coupon === 'OFFRE50') return { rate: 0.5, label: '50%' };
    if (coupon === 'GRATUIT') return { rate: 1.0, label: '100% Off !' };
    return { rate: 0, label: '0%' };
  });

  // Total price subtracting any active discounts
  protected readonly totalPrice = computed(() => {
    const base = this.basePrice();
    const disc = this.discount().rate;
    return base * (1 - disc);
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.bookingForm().invalid()) {
      console.warn('Formulaire réservation invalide');
      return;
    }
    
    console.log('Réservation validée !', this.bookingModel());
    alert(`Réservation confirmée !\nTotal à payer : ${this.totalPrice()} €`);
  }
}
