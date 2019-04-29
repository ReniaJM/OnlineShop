import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  searchTerm= '';
  isCollapsed: true;


  get token() {
    return localStorage.getItem('token')
  }

  // pobieranie tokenu

  collapse(){
    this.isCollapsed = true;
  }

  // to jest do mobilemenu

  closeDropdown(dropdown) {
    dropdown.close()
  }

  // zamykanie navbar dropdown

  logout (){}

  search (){}

}

