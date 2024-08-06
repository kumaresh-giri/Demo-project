import { Component, OnInit } from '@angular/core';
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import {DomSanitizer} from '@angular/platform-browser';
declare var window: any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerSettingContent: any = [];
  isShowLoader:any=0;
  isLoggedIn$!: Observable<any>;
  isLoggedInuser: any = "";
  isShowLoginSectionForm:any=false;
  isShowSignupSectionForm:any=false;
  loginSignupModal:any;
  isShowLoginForm:any=true;
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.commonService.getIsLoggedIn().subscribe((data: any) => {
      this.isLoggedIn$ = data;
    });
    if (window.localStorage.getItem("authtoken")) {
      this.isLoggedInuser = true;
    } else {
      this.isLoggedInuser = false;
    }
    this.fetchFooterSettings();
    this.isShowLoginForm = this.commonService.getAuthStatus();
    this.loginSignupModal = new window.bootstrap.Modal(
      document.getElementById("footerLoginSignupModal")
    );
  }
  setSigntaureCustomPizzaTab(data:any):void{
    this.commonService.setSignCustomizedPizaaTab(data);
    this.router?.navigateByUrl('customizepizza');
  }
  fetchFooterSettings() {
    //this.spinner.show();
    this.isShowLoader = 1;
    this.commonService
    .postData('',"get-settings-data")
    .subscribe(
      (res) => {
        //console.log(res?.settingData);
        //this.spinner.hide();
        this.isShowLoader = 0;
        if (res.status == "success") {
          this.footerSettingContent = res?.settingData;
         // this.cms_content = res?.data;
          // this.footerSettingContent.instagram_link = this.commonService.getValidSocialMediaUrl(this.sanitizer.bypassSecurityTrustUrl(
          //   this.footerSettingContent.instagram_link
          // ));
          // this.footerSettingContent.twitter_link = this.commonService.getValidSocialMediaUrl(this.sanitizer.bypassSecurityTrustUrl(
          //   this.footerSettingContent.twitter_link
          // ));
          // // this.footerSettingContent.facebook_link = this.commonService.getValidSocialMediaUrl(this.sanitizer.bypassSecurityTrustUrl(
          // //   this.footerSettingContent.facebook_link
          // // ));

          this.footerSettingContent.facebook_link = this.commonService.getValidSocialMediaUrl(
            this.footerSettingContent.facebook_link
          );
          this.footerSettingContent.twitter_link = this.commonService.getValidSocialMediaUrl(
            this.footerSettingContent.twitter_link
          );
          this.footerSettingContent.instagram_link = this.commonService.getValidSocialMediaUrl(
            this.footerSettingContent.instagram_link
          );

          window.localStorage.setItem("contact_address", res.settingData?.contact_address);
        } else {
           this.toastr.error(res?.message);
        }
      },
      (err) => {
        this.toastr.error('Something went wrong, Please try again later');
        //this.spinner.hide();
        this.isShowLoader = 0;
      }
    );
  }
  initLogin() {
    this.isShowLoginSectionForm = true;
    this.isShowSignupSectionForm = false;
    this.loginSignupModal.show();
   // window.localStorage.setItem('isfooter', true);
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
