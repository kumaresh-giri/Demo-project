import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

import { FormGroup } from "@angular/forms";
import { environment } from "src/environments/environment";
import { NavigationStart, NavigationError, NavigationEnd } from '@angular/router';

declare var window: any;
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isLoggedIn$!: Observable<any>;
  whetherSignCustomizedPizaaTab$!: Observable<any>;
  isLoggedInuser: any = "";
  headerAddress: any = "";
  isShowAddressEditInput: any = false;
  headerDeliveryAddressForm: any = FormGroup;
  headerdeliveryaddress: any = "";
  activeMenuSlug: any = "signature";
  loginhModal: any;
  signuphModal: any;
  isShowLoginForm: any = false;
  isShowLoginSectionForm: any = false;
  isShowSignupSectionForm: any = false;
  loginSignupModal: any;
  headerMenuSlug:any='';
  headerMenuSlugForRedirect:any='';
  public server = environment?.server;
  constructor(
    private commonservice: CommonService,
    private router: Router,
    private actvroute: ActivatedRoute
   ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
          //do something on start activity
      }
      if (event instanceof NavigationError) {
          // Handle error
          console.error(event.error);
      }
      if (event instanceof NavigationEnd) {
        if(event.urlAfterRedirects==='/customizepizza/custom'){
          this.headerMenuSlug = 'custom';
          this.headerMenuSlugForRedirect = 'custom';
        }
        else if(event.urlAfterRedirects==='/customizepizza/signature'){
          this.headerMenuSlug = 'signature';
          this.headerMenuSlugForRedirect = 'signature';
        }
        else if(event.urlAfterRedirects==='/category/salads'){
          this.headerMenuSlug = 'salads';
          this.headerMenuSlugForRedirect = 'salads';
        }
        else if(event.urlAfterRedirects==='/category/treats'){
          this.headerMenuSlug = 'treats';
          this.headerMenuSlugForRedirect = 'treats';
        }
        else if(event.urlAfterRedirects==='/category/drinks'){
          this.headerMenuSlug = 'drinks';
          this.headerMenuSlugForRedirect = 'drinks';
        }
        else {
          this.headerMenuSlug = 'custom';
          this.headerMenuSlugForRedirect = '';
        }
      }
    });
  }
  ngOnInit(): void {
    this.activeMenuSlug = this.commonservice.getActiveMenuSlug();
    this.whetherSignCustomizedPizaaTab$= this.commonservice?.getSignCustomizedPizaaTab(); 
    this.loginSignupModal = new window.bootstrap.Modal(
      document.getElementById("loginSignupModalHeader")
    );
    this.commonservice.getIsLoggedIn().subscribe((data: any) => {
      this.isLoggedIn$ = data;
    });
    if (window.localStorage.getItem("authtoken")) {
      this.isLoggedInuser = true;
    } else {
      this.isLoggedInuser = false;
    }
    if (window.localStorage.getItem("homeAddress")) {
      this.headerAddress = window.localStorage.getItem("homeAddress");
    }
  }
  setSigntaureCustomPizzaTab(data: any): void {
    this.commonservice.setSignCustomizedPizaaTab(data);
  }
  setActiveMenu(menuVal: any = "custom"): void {
    this.activeMenuSlug = menuVal;
    window.localStorage.setItem("activeMenuSlug", menuVal);
  }

  logout(): void {
    window.localStorage.setItem("homeAddress", "");
    window.localStorage.setItem("homeLat", "");
    window.localStorage.setItem("homeLong", "");
    //window.localStorage.setItem("isLoggedIn", false);
    window.localStorage.setItem("userDetails", JSON.stringify([]));
    window.localStorage.setItem("authtoken", "");
    window.localStorage.setItem("userId", "");
    this.commonservice.setIsLoggedIn(false);
    location.href = this.server;
  }
  makeEditableHeaderDeliveryLocation(): void {
    this.isShowAddressEditInput = true;
  }
  handleHeaderDeliveryAddressChange(homedaddress: any) {
    if (homedaddress.formatted_address) {
      this.isShowAddressEditInput = false;
      window.localStorage.setItem(
        "homeAddress",
        homedaddress.formatted_address
      );
      window.localStorage.setItem(
        "homeLat",
        homedaddress.geometry.location.lat()
      );
      window.localStorage.setItem(
        "homeLong",
        homedaddress.geometry.location.lng()
      );
      this.headerAddress = homedaddress.formatted_address;
      let latlongaddress = {
        address: homedaddress.formatted_address,
        addresslat: homedaddress.geometry.location.lat(),
        addressLong: homedaddress.geometry.location.lng(),
      };
      this.commonservice.setHeaderAddressLatLong(latlongaddress);
    }
  }
  initLogin() {
    this.isShowLoginSectionForm = true;
    this.isShowSignupSectionForm = false;
    this.loginSignupModal.show();
  }
  initSignup() {
    this.isShowLoginSectionForm = false;
    this.isShowSignupSectionForm = true;
    this.loginSignupModal.show();
  }
  setloginSignup(type: any = 0) {
    if (type == 1) {
      this.isShowLoginSectionForm = false;
      this.isShowSignupSectionForm = true;
    } else {
      this.isShowLoginSectionForm = true;
      this.isShowSignupSectionForm = false;
    }
  }
}
