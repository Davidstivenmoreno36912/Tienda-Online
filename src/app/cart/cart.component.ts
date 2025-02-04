import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

declare var paypal: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterViewInit {

  cartItems: any[] = [];
  totalAmount: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.calculateTotalAmount();
    });
  }

  ngAfterViewInit(): void {
    this.initializePayPalButton();
  }

  calculateTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.totalAmount = this.calculateTotalAmount();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.totalAmount = this.calculateTotalAmount();
    }
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(i => i !== item);
    this.totalAmount = this.calculateTotalAmount();
  }

  initializePayPalButton() {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: Math.round(this.totalAmount).toString(), // Redondeado para evitar errores con PayPal
              currency_code: 'USD'
            },
            description: 'Compra de aceites esenciales'
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert(`Pago exitoso, gracias ${details.payer.name.given_name}`);
          this.router.navigate(['/confirmacion-pago']);
        });
      },
      onError: (err: any) => {
        console.error('Error en el pago con PayPal:', err);
        alert('Hubo un error al procesar el pago.');
      }
    }).render('#paypal-button-container');
  }
}
