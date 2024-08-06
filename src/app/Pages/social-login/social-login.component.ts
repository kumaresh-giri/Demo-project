import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var window: any;
declare const gapi: any;
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss'],
})
export class SocialLoginComponent implements OnInit {
  googleClientId: string = environment?.googleLoginConfig?.clientId;
  facebookAppId: string = environment?.facebookLoginConfig?.appId;
  apiUrl: string = environment?.apiURL;
  auth2: any;
  @ViewChild('googleLoginRef', { static: true })
  googleLoginElement!: ElementRef;
  isSubmitted:any=false;
  loginCloseModal:any;
  FB: any;
  userId:any='';
  public siteUrlWithoutSlash = environment?.siteUrlWithoutSlash;
  public server = environment?.server;
  constructor(
    private router: Router,
    private commonservice: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private element: ElementRef
  ) {
    //console.log('ElementRef: ', this.element);
  }

  ngOnInit(): void {
    this.userId = this.commonservice?.getUserUuid();
    // if(window.localStorage.getItem("userId")){
    //   this.userId = window.localStorage.getItem("userId");
    // }
    // else{
    //   const currentTimeInMilliseconds: string = uuidv4()+Date.now();
    //   window.localStorage.setItem("userId", currentTimeInMilliseconds);
    //   this.userId = window.localStorage.getItem("userId");
    // }
    this.fbLibrary();
    // this.loginCloseModal = new window.bootstrap.Modal(
    //   document.getElementById("loginModal")
    // );
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: this.googleClientId,
        cookiepolicy: 'single_host_origin',
        scope: 'profile email',
        plugin_name:'code red pizza'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public attachSignin(element: any) {
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser: any) => {
        let profile = googleUser.getBasicProfile();
        this.googleAuthenticationSubmit(
          profile.getId(),
          profile.getEmail(),
          profile.getName(),
        );
      },
      (error: any) => {
        //alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
  
  googleAuthenticationSubmit(google_id: any,email: any,name: any) {
    this.spinner.show();
    this.commonservice.postData({user_name:name,email_id:email,social_id:google_id,login_by:'gp',user_id:this.userId}, "social-login").subscribe(res => {
      if (res?.status === 'success') {
        this.toastr.success('Logged in successfully.');
        //this.loginCloseModal.hide();
		
        //this.router?.navigateByUrl('dashboard');
        window.localStorage.setItem('isLoggedIn', true);
        let userdetais = res?.user;
        window.localStorage.setItem(
          'userDetails',
          JSON.stringify(userdetais)
        );
        window.localStorage.setItem('authtoken',res?.token);
        window.localStorage.setItem("userId", res?.user?._id);
        this.commonservice.setIsLoggedIn(true);
       // window.location.href=this.server + 'dashboard';
        if(localStorage.getItem('lastVisitedUrl')){
          // $('#closeAddExpenseModal').click();
          window.location.href=this.siteUrlWithoutSlash + localStorage.getItem('lastVisitedUrl');
        }
        else{
          window.location.href=this.server + 'dashboard';
        }

      }
      else if(res?.status ==='email_verification_error') {
        this.toastr.error(res?.message);
        this.spinner.hide();
      }
      else{
        this.toastr.error(res?.message);
        this.spinner.hide();
      }
    },
    err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong, Please try again later');
    });
	}

  fbLibrary() {
    (window as any).fbAsyncInit = function () {
      window['FB'].init({
        appId: this.facebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v2.2'
      });
      window['FB'].AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js:any, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      //js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.src = "https://connect.facebook.net/en_US/sdk.js#version=v2.2&appId=419587880212370&xfbml=true&autoLogAppEvents=true";
      fjs.parentNode?.insertBefore(js, fjs);
      
    }(document, 'script', 'facebook-jssdk'));
  }

  facebookAuth(): void {
    //this.fbLibrary();
    window['FB'].login(
      (response:any) => {
        this.fbLibrary();
        if (response.authResponse) {
          window['FB'].api(
            '/me',
            {
              fields: 'last_name, first_name, email',
            },
            (userInfo:any) => {
              this.fbAuthenticationSubmit(
                userInfo.id,
                userInfo.email,
                userInfo.first_name + ' ' + userInfo.last_name
              );
            }
          );
        } else {
          //this.notifyService.showWarning("Facebook Authentication Failed", "Login Failed")
        }
      },
      { scope: 'email' }
    );
  }
  
  fbAuthenticationSubmit(
    facebook_id: any,
    email: any,
    name: any,
    ): void {
    this.spinner.show();
    this.commonservice.postData({user_name:name,email_id:email,social_id:facebook_id,login_by:'fb',user_id:'saroj'}, "social-login").subscribe(res => {
      if (res?.status === 'success') {
        this.toastr.success('Logged in successfully.');
        //this.loginCloseModal.hide();
        //this.router?.navigateByUrl('dashboard');
        window.localStorage.setItem('isLoggedIn', true);
        let userdetais = res?.user;
        window.localStorage.setItem(
          'userDetails',
          JSON.stringify(userdetais)
        );
        window.localStorage.setItem('authtoken',res?.token);
        window.localStorage.setItem("userId", res?.user?._id);
        this.commonservice.setIsLoggedIn(true);
        window.location.href=this.server + 'dashboard';
      }
      else if(res?.status ==='email_verification_error') {
        this.toastr.error(res?.message);
        this.spinner.hide();
      }
      else{
        this.toastr.error(res?.message);
        this.spinner.hide();
      }
    },
    err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong, Please try again later');
    });
  }

  setLocalStorage(
    isLoggedIn?: string,
    userDetails?: string,
    authtoken?: string,
    Wishlist?: string
  ): void {
    isLoggedIn && window.localStorage.setItem('isLoggedIn', isLoggedIn);
    userDetails && window.localStorage.setItem('userDetails', userDetails);
    authtoken && window.localStorage.setItem('authtoken', authtoken);
    //Wishlist && window.localStorage.setItem('wishlist', Wishlist);
    this.commonservice?.setUser();
    this.router.navigateByUrl(localStorage.getItem('lastVisitedUrl') || '/');
  }
}
