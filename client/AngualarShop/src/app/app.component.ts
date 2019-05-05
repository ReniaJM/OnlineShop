import { Component } from '@angular/core';
import {DataService} from './data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  searchTerm = '';
  isCollapsed: true;

  constructor(private router: Router, private data: DataService) {
    this.data.getProfile();
    this.data.cartItems = this.data.getCart().length;
  }


  get token() {
    return localStorage.getItem('token');
  }

  // pobieranie tokenu

  collapse() {
    this.isCollapsed = true;
  }

  // to jest do mobilemenu

  closeDropdown(dropdown) {
    dropdown.close();
  }

  // zamykanie navbar dropdown

  logout() {
    this.data.user = {};
    this.data.cartItems = 0;
    localStorage.clear();
    this.router.navigate(['']);
  }

  search() {}

}

