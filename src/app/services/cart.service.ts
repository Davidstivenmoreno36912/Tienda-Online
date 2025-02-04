import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cart.asObservable();

  addToCart(item: CartItem) {
    const currentCart = this.cart.value;
    const existingItem = currentCart.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentCart.push(item);
    }

    this.cart.next(currentCart);
  }

  updateQuantity(itemId: number, quantity: number) {
    const currentCart = this.cart.value;
    const item = currentCart.find(i => i.id === itemId);

    if (item) {
      item.quantity = quantity;
    }

    this.cart.next(currentCart);
  }

  removeFromCart(itemId: number) {
    const currentCart = this.cart.value;
    const updatedCart = currentCart.filter(i => i.id !== itemId);

    this.cart.next(updatedCart);
  }

  clearCart() {
    this.cart.next([]);
  }
}
