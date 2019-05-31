 import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {RestApiService} from '../rest-api.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryId: any;
  category: any;
  page = 1;

  constructor(private data: DataService,
              private rest: RestApiService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // sprawdza aktywny route i subscrybuje go, jest update id,i pobiera produkt
    this.activatedRoute.params.subscribe(res => {
      this.categoryId = res['id'];
      this.getProducts();
    });
  }

  // najmniejsza ilosc 10 produktow na strone
  get lower() {
    return 10 * (this.page -1) + 1;
  }
  // max produktow pobieraca wszytkie produkty z zapytania

  get upper() {
    return Math.min(10 * this.page, this.category.totalProducts);
  }

  async getProducts(event?: any) {
    if(event) {
      this.category = null;
    }
    try {
      const data = await this.rest.get(
        `http://localhost:3030/api/categories/${this.categoryId}?page=${this.page - 1}`
        // po stronie frontu page jest na 1, po stronie back 0, dlatego jest -1
      );
      data['success']
      ? (this.category=data)
      : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message'])
    }
  }

}
