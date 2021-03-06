import { Injectable } from '@angular/core';

import { NavigationStart, Router } from '@angular/router';

import { RestApiService } from './rest-api.service';

@Injectable()
export class DataService {
  message = '';
  messageType = 'danger';
  user: any;
  cartItems: 0;

  constructor(private router: Router, private rest: RestApiService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.message = '';
        // pokazuje spinner w trakcia ladowania danych
        // sa subscrybowane eventy
      }
    });
  }

  // wiadomosci w aplikacji do kazdego komponentu przesylane przez component message
  error(message) {
    this.messageType = 'danger';
    this.message = message;
  }

  success(message) {
    this.messageType = 'success';
    this.message = message;
  }

  warning(message) {
    this.messageType = 'warning';
    this.message = message;
  }

  // pobieranie profilu, dodawana do appc

  async getProfile() {
    try {
      // jesli jest token w localStorage
      if (localStorage.getItem('token')) {
        const data = await this.rest.get(
          'http://localhost:3030/api/accounts/profile',
        );
        this.user = data['user'];
        // console.log(this.user);
      }
    } catch (e) {
      this.error(e);
    }
  }

  // pobieranie produktu
  getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }


  // dodawanie produktu
  addToCart(item: string) {
    const cart: any = this.getCart();
    if (cart.find(data => JSON.stringify(data) === JSON.stringify(item))) {
      return false;
    } else {
      cart.push(item);
      this.cartItems++;
      localStorage.setItem('cart', JSON.stringify(cart));
      return true;
    }
  }

  // usuwanie produktu
  removeFromCart(item: string) {
    let cart: any = this.getCart();
    if (cart.find(data => JSON.stringify(data) === JSON.stringify(item))) {
      cart = cart.filter(data => JSON.stringify(data) !== JSON.stringify(item));
      this.cartItems--;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  // czyszczenie karty
  clearCart() {
    this.cartItems = 0;
    localStorage.setItem('cart', '[]');
  }
}
