import { Injectable } from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {RestApiService} from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  message = '';
  messageType =  'danger';

  constructor(private router: Router, private rest: RestApiService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.message = '';
      }
    });
  }
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

  async getProfile() {
    try {
      if (localStorage.getItem('token')) {
        const data = await this.rest.get(
          'http://localhost:3030/api/accounts/profile'
        );
        this.user = data.user;
      } catch (error) {
        this.error(error);
      }
    }
  }

}
