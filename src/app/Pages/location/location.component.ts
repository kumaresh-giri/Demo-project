import { Component, OnInit } from '@angular/core';
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import {DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  cmsContent: any = [];
  contactContent: any = [];
  contactAddress:any='';
  contactLat:any='';
  contactLong:any='';
  isShowLoader:any=0;
  mapsURL:any ='';
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.fLocationSettings();
    this.fetchCms();   
  }
  async fLocationSettings() {
    this.spinner.show();
    this.isShowLoader = 1;
    await this.commonService
    .postData('',"get-settings-data")
    .subscribe(
      (res) => {
        this.isShowLoader = 0;
        if (res.status == "success") {
          this.contactAddress = res?.settingData?.contact_address;
          this.fetchLocationName(res?.settingData?.contact_address);
        } else {
          this.spinner.hide();
          this.toastr.error(res?.message);
        }
      },
      (err) => {
        this.toastr.error('Something went wrong, Please try again later');
        this.spinner.hide();
        this.isShowLoader = 0;
      }
    );
  }

  async fetchLocationName(address:any)  {
    await fetch(
      'https://maps.google.com/maps/api/geocode/json?address='+address+'&key=AIzaSyC-1NczEtQqYZCz_tMQDvsuTlOQq7lbnhA',
      )
      .then((response) => response.json())
      .then((responseJson) => {
      this.spinner.hide();
      var data = JSON.parse(JSON.stringify(responseJson));
        this.contactLat=data?.results[0]?.geometry?.location?.lat;
        this.contactLong=data?.results[0]?.geometry?.location?.lng;
        this.mapsURL = `https://maps.google.com/maps?q=${this.contactLat},${this.contactLong}&hl=es;z=14&output=embed`;
      });
    this.spinner.hide();
  };

  fetchCms() {
    this.spinner.show();
    this.isShowLoader = 1;
    this.commonService
    .postData(
      {cms_slug:'location'},
      "get-cms-data"
    )
    .subscribe(
      (res) => {
        this.spinner.hide();
        this.isShowLoader = 0;
        if (res.status == "success") {
          this.cmsContent = res?.page_data;
        } else {
          this.toastr.error(res?.message);
        }
      },
      (err) => {
        this.toastr.error('Something went wrong, Please try again later');
        this.spinner.hide();
        this.isShowLoader = 0;
      }
    );
  }
}
