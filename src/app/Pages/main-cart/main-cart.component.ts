import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-cart',
  templateUrl: './main-cart.component.html',
  styleUrls: ['./main-cart.component.scss']
})
export class MainCartComponent implements OnInit {


  hide1:boolean = false;
  accordion1(){
    this.hide1 = !this.hide1;
  }
  hide:boolean = false;
  accordion(){
    this.hide = !this.hide;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
