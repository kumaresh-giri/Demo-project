import { Component, OnInit,ViewChild,ElementRef } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from "uuid";
import { CustomValidators } from 'src/app/validator/CustomValidators';
declare var window: any;
import Swal from 'sweetalert2';
import * as CryptoTS from 'crypto-ts';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userId:any='';
  loginCloseModal:any;
  loginForm: any = FormGroup;
  verifyEmailForm:any=FormGroup;
  forgotPasswordForm:any=FormGroup;
  resetPasswordForm:any=FormGroup;
  isVerifyEmailSubmitted:any=false;
  isForgotPasswordSubmitted:any=false;
  isResetPasswordSubmitted:any=false;
  isSubmitted: any = false;
  isShowlogin:any=true;
  isShowVerifyEmail:any=false;
  isShowforgotPassword:any=false;
  isShowResetPassword:any=false;
  emailtoVerify:any='';
  is_remember_me:any=false;
  rememberemail:any ='';
  rememberpassword:any ='';
  signupModal:any;
  loginModal:any;
  loginSignupModal:any;
  loginPageSettingContent:any=[];
  captchaSiteKey:  string = environment?.captchaConfig?.siteKey;
  isShowPasswordEye: any = false;
  isShowResetPasswordEye: any = false;
  isShowResetConfrimPasswordEye: any = false;
  isFromFooterLoginReq:any = false;
  
  //captchaSiteKey:any='';
  public server = environment?.server;
  public siteUrlWithoutSlash = environment?.siteUrlWithoutSlash;
  @ViewChild('buttontoCloseLogin') buttontoCloseLogin!: ElementRef;
  constructor(
    private router: Router,
    private commonservice: CommonService,
		private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    
    this.fetchLoginpageSettings();
    this.userId = this.commonservice?.getUserUuid();
    this.loginForm = this.formBuilder.group({
      email_id: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      user_id:[this.userId],
      remember_me:[''],
      recaptcha: ['', Validators.required]
    });
    let remember_me =  window.localStorage.getItem("remember_me");
    if(remember_me==='true' ){
      this.rememberemail = window.localStorage.getItem('rememberemail');
      this.rememberpassword = window.localStorage.getItem('rememberpassword');
      let decrpted_pass = CryptoTS.AES.decrypt(this.rememberpassword, environment?.encyptdecryptPassword).toString(CryptoTS.enc.Utf8);
      this.loginForm?.patchValue({ 
        email_id: this.rememberemail,
       remember_me:true,
       password:decrpted_pass
      });
    }
    else{
      this.loginForm?.patchValue({ 
        email_id: '',
        remember_me:false,
        password:''
      });
    }
    this.verifyEmailForm = this.formBuilder.group({
      email_id: [''],
      otp: ['', [Validators.required]],
    });
    this.forgotPasswordForm = this.formBuilder.group({
      email_id: ['', [Validators.required, Validators.email]],
      frecaptcha: ['', Validators.required]
    });
    this.resetPasswordForm = this.formBuilder.group({
      otp: ['', Validators.required],
      email_id: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['',[Validators.required]],
      rrecaptcha: ['', Validators.required]
    },
    {
      validator: CustomValidators.mustMatch('password', 'confirm_password'),
    });
    
  }
  get fve() {
    return this.verifyEmailForm.controls;
  }
  get LoginFcontrol() {
    return this.loginForm.controls;
  }
  get forgotFcontrol() {
    return this.forgotPasswordForm.controls;
  }
  get resetFcontrol() {
    return this.resetPasswordForm.controls;
  }
  closeLoginModal():void{
    this.loginForm?.patchValue({
      email_id: '',
      password:''
    });
  }
  loginFormSubmit() {
    this.isSubmitted = true;
		if (this.loginForm.status == "VALID") {
			//this.spinner.show();
			this.commonservice.postData(this.loginForm.value, "signinme").subscribe(res => {
				//this.spinner.hide();
        
        if (res?.status === 'success') {
          this.toastr.success('Logged in successfully.');
					//this.loginForm.reset(); 
          this.isSubmitted = false;
          //window.location.href='dashboard';
          //this.router?.navigateByUrl('dashboard');
          let remember_me =this.loginForm.controls['remember_me'].value;
          let password =this.loginForm.controls['password'].value;
          let email =this.loginForm.controls['email_id'].value;
          this.localRememberMeSetup(email,password,remember_me);
          this.loginForm?.patchValue({
            email_id: '',
            password:''
          });
          this.isSubmitted = false;
          //this.loginCloseModal.hide();
          //window.location.href='dashboard';
          //this.router?.navigateByUrl('dashboard');
          //window.location.href=this.server + 'dashboard';
          window.localStorage.setItem('isLoggedIn', true);
          let userdetais = res?.user;
          userdetais.password='';
          window.localStorage.setItem(
            'userDetails',
            JSON.stringify(userdetais)
          );
          window.localStorage.setItem('authtoken',res?.token);
          window.localStorage.setItem("userId", res?.user?._id);
          this.commonservice.setIsLoggedIn(true);
          if(localStorage.getItem('lastVisitedUrl')){
            let last_url = localStorage.getItem('lastVisitedUrl');
            window.localStorage.setItem('lastVisitedUrl','');
            // $('#closeAddExpenseModal').click();
            window.location.href=this.siteUrlWithoutSlash + last_url;

          }
          else{
            window.location.href=this.server + 'dashboard';
          }
        }
				else if(res?.status ==='email_verification_error') {
          this.toastr.error(res?.message);
          this.confirmBox();
          // this.isShowlogin=false;
          // this.isShowVerifyEmail=true;
          // this.isShowforgotPassword=false;
          // this.isShowResetPassword=false;
          // this.verifyEmailForm?.patchValue({
          //   email_id: this.loginForm.controls['email_id'].value,
          // });
          // this.emailtoVerify=this.loginForm.controls['email_id'].value;

        }
        else{
          this.toastr.error(res?.message);
        }
			},
			err => {
				this.spinner.hide();
        this.toastr.error('Something went wrong, Please try again later');
      });
		}
	}
  verifyEmailFormSubmit() {
		this.isVerifyEmailSubmitted = true;
		if (this.verifyEmailForm.status == "VALID") {
			//this.spinner.show();
			this.commonservice.postData(this.verifyEmailForm.value, "verify-email").subscribe(res => {
				//this.spinner.hide();
        if (res.status === 'success') {
          this.toastr.success('Email verified successfully');
					this.verifyEmailForm.reset();
					this.isVerifyEmailSubmitted = false;
          this.isShowlogin=true;
          this.isShowVerifyEmail=false;
          this.isShowforgotPassword=false;
          this.isShowResetPassword=false;
          // this.formModal.show();
					this.loginForm?.patchValue({
            email_id: '',
            password:''
          });
				}
				else {
          this.toastr.error(res?.message);
				}
			},
			err => {
			//	this.spinner.hide();
        this.toastr.error('Something went wrong, Please try again later');
		  });
		}
	}

  setForgotPasswordScreen():void{
    this.isShowlogin=false;
    this.isShowVerifyEmail=false;
    this.isShowforgotPassword=true;
    this.isShowResetPassword=false;
  }
  setLoginScreen():void{
    this.isShowlogin=true;
    this.isShowVerifyEmail=false;
    this.isShowforgotPassword=false;
    this.isShowResetPassword=false;
  }

  resendOtp():void{
    this.commonservice
      .postData({email_id:this.emailtoVerify}, 'resend-otp')
      .subscribe(
        (res) => {
          if (res.status == 'success') {
            this.toastr.success('An otp has been send to your email');
          }else{
            this.toastr.error(res?.message);
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error('Something went wrong, Please try again later');
        }
      );
  } 
  forgotPasswordFormSubmit():void{
    this.isForgotPasswordSubmitted = true;
		if (this.forgotPasswordForm.status == "VALID") {
			//this.spinner.show();
			this.commonservice.postData(this.forgotPasswordForm.value, "forgot-password").subscribe(res => {
				//this.spinner.hide();
       // console.log(res);
				if (res.status === 'success') {
          this.toastr.success('Your forgot password request submitted successfully');
					this.resetPasswordForm?.patchValue({
            email_id: this.forgotPasswordForm.controls['email_id'].value,
          });
          this.emailtoVerify = this.forgotPasswordForm.controls['email_id'].value;
          this.forgotPasswordForm.reset();
					this.isForgotPasswordSubmitted = false;
          this.isShowlogin=false;
          this.isShowVerifyEmail=false;
          this.isShowforgotPassword=false;
          this.isShowResetPassword=true;
        }
				else {
          this.toastr.error(res?.message);
				}
			},
			err => {
				this.toastr.error('Something went wrong, Please try again later');
			});
		}
  } 
  resetPasswordFormSubmit():void{
    //console.log('resetPasswordFormSubmit');
    this.isResetPasswordSubmitted = true;
		if (this.resetPasswordForm.status == "VALID") {
			//this.spinner.show();
			this.commonservice.postData(this.resetPasswordForm.value, "reset-password").subscribe(res => {
				//this.spinner.hide();
       // console.log(res);
       // this.toastr.error(res?.message);
       	if (res.status === 'success') {
          this.isShowlogin=true;
          this.isShowVerifyEmail=false;
          this.isShowforgotPassword=false;
          this.isShowResetPassword=false;
          this.toastr.success('Your password is reset successfully');
        }
				else {
          this.toastr.error(res?.message);
				}
			},
			err => {
				this.toastr.error('Something went wrong, Please try again later');
			});
		}
  } 
  confirmBox(){
    Swal.fire({
      title: 'Are you sure want to verify email?',
      text: 'You will be able to verify email and further you can login!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, verify email!',
      cancelButtonText: 'No, I will do it later'
    }).then((result) => {
      if (result.value) {
        
        // Swal.fire(
        //   'Success!',
        //   'So we can proceed to verify your email',
        //   'success'
        // )
        this.isShowlogin=false;
          this.isShowVerifyEmail=true;
          this.isShowforgotPassword=false;
          this.isShowResetPassword=false;
          this.verifyEmailForm?.patchValue({
            email_id: this.loginForm.controls['email_id'].value,
          });
          this.emailtoVerify=this.loginForm.controls['email_id'].value;
          this.resendOtp();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'You can verify it later :)',
          'error'
        )
      }
    })
  }
  localRememberMeSetup(email: any,password:any,remember_me:any): void {
    let encrpted_pass = CryptoTS.AES.encrypt(password,environment.encyptdecryptPassword).toString();
    let is_remember_me = (remember_me) ? 'true':'false';
    //console.log('is_remember_me'+is_remember_me);
    if(is_remember_me){
      window.localStorage.setItem('rememberemail', email);
      window.localStorage.setItem('rememberpassword', encrpted_pass);
      window.localStorage.setItem('remember_me', is_remember_me);
    }
    else{
      window.localStorage.setItem('rememberemail', '');
      window.localStorage.setItem('rememberpassword','');
      window.localStorage.setItem('remember_me', is_remember_me);
    }
  }

 

  setSignupScreen(){
   // triggerClick() {
    //await $('#loginModal').hide();
   // $('#loginModal').find("data-dismiss").click();
    
    //$('#loginModal').find("data-dismis").click();
    //$('#close-modal').click();
    //await $('.modal-backdrop').hide();
  //$('#buttontoCloseLogin').click();
  //}
    //$('#buttontoCloseLogin').click();
    //this.signupModal.show();
    //this.closebutton.nativeElement.click();
    //$('#loginModal').modal('hide');

    //this.loginCloseModal.hide();
    

    //var modalToggle = document.getElementById('loginModal');
    //this.loginModal.hide()
    
    //this.loginModal.hide();
  }
 async  fetchLoginpageSettings() {
    //this.spinner.show();
    //this.isShowLoader = 1;
    await this.commonservice
    .postData('',"get-settings-data")
    .subscribe(
      (res) => {
       //this.captchaSiteKey =  res?.settingData?.google_captcha_key;
       // console.log(res?.settingData);
        //this.spinner.hide();
        //this.isShowLoader = 0;
        if (res.status == "success") {
          this.loginPageSettingContent = res?.settingData;
        } else {
           this.toastr.error(res?.message);
        }
      },
      (err) => {
        this.toastr.error('Something went wrong, Please try again later');
        //this.spinner.hide();
        //this.isShowLoader = 0;
      }
    );
  }
  resesndOtp(): void {
    this.commonservice
      ?.postData(
        this.forgotPasswordForm?.getRawValue(),
        'resend-forgot-password-otp'
      )
      ?.subscribe(
        (res) => {
          this.spinner.hide();
          if (res?.status) {
           // this.otp = res?.data?.otp;
            //this.forgotPasswordForms?.get('password')?.disable();
            //this.forgotPasswordForms?.get('password_confirmation')?.disable();
            this.commonservice?.showSuccess(res?.message, 'Resend Otp');
          }
        },
        (err) => {
          this.spinner.hide();
          this.commonservice?.showError(err?.message, 'Reset Otp');
        }
      );
  }

  togglePassword(){
    this.isShowPasswordEye = !this.isShowPasswordEye;
  }
  
  toggleResetPassword(){
    this.isShowResetPasswordEye = !this.isShowResetPasswordEye;
  }
  toggleResetConfirmPassword(){
    this.isShowResetConfrimPasswordEye = !this.isShowResetConfrimPasswordEye; 
  }

  

}
