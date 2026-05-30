import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { JsonPipe, UpperCasePipe } from '@angular/common';
import { form, FormField, required, min, max, validate } from '@angular/forms/signals';

interface BookingModel {
  ticketType: string;
  quantity: number;
  couponCode: string;
}

@Component({
  selector: 'app-booking-derived',
  imports: [FormField, JsonPipe, UpperCasePipe],
  templateUrl: './booking-derived.html',
  styleUrl: './booking-derived.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingDerived {
  // Model signal
  bookingModel = signal<BookingModel>({
    ticketType: 'standard',
    quantity: 1,
    couponCode: '',
  });

  // Defining validation rules with cross-field validator
  bookingForm = form(this.bookingModel, (schemaPath) => {
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
  ticketPrices: Record<string, number> = {
    standard: 25,
    vip: 75,
    student: 15,
  };

  // Base price derived from selected ticketType and quantity
  basePrice = computed(() => {
    const type = this.bookingForm.ticketType().value();
    const qty = this.bookingForm.quantity().value();
    const unitPrice = this.ticketPrices[type] || 0;
    return unitPrice * qty;
  });

  // Discount percentage derived from couponCode validation and value
  discount = computed(() => {
    const coupon = this.bookingForm.couponCode().value().trim().toUpperCase();
    const hasError = this.bookingForm.couponCode().invalid();
    
    if (!coupon || hasError) return { rate: 0, label: '0%' };
    if (coupon === 'REDUC20') return { rate: 0.2, label: '20%' };
    if (coupon === 'OFFRE50') return { rate: 0.5, label: '50%' };
    if (coupon === 'GRATUIT') return { rate: 1.0, label: '100% Off !' };
    return { rate: 0, label: '0%' };
  });

  // Total price subtracting any active discounts
  totalPrice = computed(() => {
    const base = this.basePrice();
    const disc = this.discount().rate;
    return base * (1 - disc);
  });

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.bookingForm().invalid()) {
      console.warn('Formulaire réservation invalide');
      return;
    }
    
    console.log('Réservation validée !', this.bookingModel());
    alert(`Réservation confirmée !\nTotal à payer : ${this.totalPrice()} €`);
  }
}
