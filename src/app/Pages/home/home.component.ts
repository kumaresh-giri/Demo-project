import { Component, OnInit } from "@angular/core";
import { v4 as uuidv4 } from "uuid";
import { Router } from "@angular/router";
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  //userId: any;
  homeAddressForm: any = FormGroup;
  homeAddress: any = "";
  public lat: any;
  public lng: any;
  contactAddress:any='';
  homeContactAddress:any='';
  cmsContent:any='';
  homeSettingContent:any='';
  isShowSubMenu:any=false;
  isLoggedInuser: any = "";
  public imageBaseUrl = environment?.imageBaseUrl;
  public server = environment?.server;
  constructor(
    private commonservice: CommonService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.fetchCms();
  }

  ngOnInit(): void {
    this.commonservice.setSignCustomizedPizaaTab("custom");
    this.homeAddressForm = this.formBuilder.group({
      homeaddress: ["", Validators.required],
    });
    if (window.localStorage.getItem("authtoken")) {
      this.isLoggedInuser = true;
    } else {
      this.isLoggedInuser = false;
    }
    if (window.localStorage.getItem("homeAddress")) {
      this.homeAddress = window.localStorage.getItem("homeAddress");
    }
    this.homeAddressForm?.patchValue({
      homeaddress: this.homeAddress,
    });
  }

  setSigntaureCustomPizzaTab(data: any): void {
    this.commonservice.setSignCustomizedPizaaTab(data);
    //this.router?.navigateByUrl("customizepizza");
  }

  handleHomeAddressChange(homeaddress: any) {
    if (homeaddress.formatted_address) {
      window.localStorage.setItem("homeAddress", homeaddress.formatted_address);
      window.localStorage.setItem(
        "homeLat",
        homeaddress.geometry.location.lat()
      );
      window.localStorage.setItem(
        "homeLong",
        homeaddress.geometry.location.lng()
      );
      let latlongaddress = {
        address: homeaddress.formatted_address,
        addresslat: homeaddress.geometry.location.lat(),
        addressLong: homeaddress.geometry.location.lng(),
      };
      this.commonservice.setHeaderAddressLatLong(latlongaddress);
      this.homeAddressForm?.patchValue({
        homeaddress: homeaddress.formatted_address,
      });
      this.router?.navigateByUrl("customizepizza");
    }
  }

  findMyCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position);
       // console.log(
          //"Latitude: " +
           // position.coords.latitude +
            //"Longitude: " +
            //position.coords.longitude
        //);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.fetchLocationName(this.lat, this.lng);
      });
    } else {
      //alert("Geolocation is not supported by this browser.");
    }
  }

  async fetchLocationName(lat: any, lng: any) {
    await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        lat + "," +lng +"&key=AIzaSyC-1NczEtQqYZCz_tMQDvsuTlOQq7lbnhA"
    )
    .then((response) => response.json())
    .then((responseJson) => {
      var data = JSON.parse(JSON.stringify(responseJson));
      var address = data.results[0]?.formatted_address;
      window.localStorage.setItem("homeAddress", address);
      window.localStorage.setItem("homeLat", lat);
      window.localStorage.setItem("homeLong", lng);
      let latlongaddress = {
        address: address,
        addresslat: lat,
        addressLong: lng,
      };
      this.commonservice.setHeaderAddressLatLong(latlongaddress);
      this.homeAddressForm?.patchValue({
        homeaddress: data.results[0]?.formatted_address,
      });
      this.router?.navigateByUrl("customizepizza");
    });
  }
  ngAfterViewInit() {
    this.fetchHomeSettings();
  }

  fetchCms() {
    this.spinner.show();
    this.commonservice
    .postData(
      {cms_slug:'home'},
      "get-cms-data"
    )
    .subscribe(
      (res) => {
        this.spinner.hide();
        if (res.status == "success") {
          this.cmsContent = res?.page_data;
        } else {
          this.toastr.error(res?.message);
        }
      },
      (err) => {
        this.toastr.error('Something went wrong, Please try again later');
        this.spinner.hide();
      }
    );
  }
  fetchHomeSettings() {
    this.commonservice
    .postData('',"get-settings-data")
    .subscribe(
      (res) => {
        if (res.status == "success") {
          //console.log('res');
          ///console.log(res);
          this.homeSettingContent = res?.settingData;
          this.homeContactAddress = res?.settingData?.contact_address;
          window.localStorage.setItem("contact_address", res.settingData?.contact_address);
        } else {
           this.toastr.error(res?.message);
        }
      },
      (err) => {
        //this.toastr.error('Something went wrong, Please try again later');
      }
    );
  }
  showHideSubMenu(){
    this.isShowSubMenu = !this.isShowSubMenu;
  }
  logout(): void {
    //console.log('logout');
    window.localStorage.setItem("homeAddress", "");
    window.localStorage.setItem("homeLat", "");
    window.localStorage.setItem("homeLong", "");
    //window.localStorage.setItem("isLoggedIn", false);
    window.localStorage.setItem("userDetails", JSON.stringify([]));
    window.localStorage.setItem("authtoken", "");
    window.localStorage.setItem("userId", "");
    this.commonservice.setIsLoggedIn(false);
    // if(this.headerMenuSlugForRedirect==''){
    //   location.href = this.server+'customizepizza/custom';
    // }
    // else{
    //   location.href = this.server;
    // }
    location.href = this.server;
   // window.location.reload();
  }
}
