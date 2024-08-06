import { Component, OnInit,ViewChild,ElementRef } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/validator/CustomValidators';
import { environment } from "src/environments/environment";
declare var window: any;
declare var $: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isSubmitted: any = false;
  isVerifyEmailSubmitted:any=false;
  signupForm: any = FormGroup;  
  verifyEmailForm:any=FormGroup;
  signupCloseModal:any;
  email:any='';
  isShowSignUp:any=true;
  emailtoVerify:any='';
  loginWithinSignupModal:any;
  signupPageSettingContent:any=[];
  @ViewChild('buttontoCloseSignup') buttontoCloseSignup!: ElementRef;
  captchaSiteKey:  string = environment?.captchaConfig?.siteKey;
  isShowPasswordEye: any = false;
  isShowConfrimPasswordEye: any = false;
  //captchaSiteKey:any='';
  constructor(
    private router: Router,
    private commonservice: CommonService,
		private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.fetchSignupPageSettings();
    this.signupForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['',[Validators.required]],
      recaptcha: ['', [Validators.required]]
    },
    {
      validator: CustomValidators.mustMatch('password', 'confirm_password'),
    }
    );
    // verify email form validation condition
    this.verifyEmailForm = this.formBuilder.group({
      email_id: [''],
      otp: ['', [Validators.required]],
      verecaptcha: ['', Validators.required]
    });
    
  }
  // to verify submit form
  get f() {
    return this.signupForm.controls;
  }
  // to verify verify email form
  get fve() {
    return this.verifyEmailForm.controls;
  }
  signupFormSubmit() {
  	this.isSubmitted = true;
		if (this.signupForm.status == "VALID") {
			//this.spinner.show();
			this.commonservice.postData(this.signupForm.value, "sign-up-me").subscribe(res => {
				//this.spinner.hide();
				if (res.status === 'success') {
          this.toastr.success('Signed up successfully, Please verify otp');
					this.verifyEmailForm?.patchValue({
            email_id: this.signupForm.controls['email_id'].value,
          });
          this.emailtoVerify=this.signupForm.controls['email_id'].value;
          this.signupForm.reset();
					this.isSubmitted = false;
          this.isShowSignUp=false;
        }
        else if (res.status === 'val_err') {
          const errormsgs = res?.val_msg;
          for (var key in errormsgs) {
            if (errormsgs.hasOwnProperty(key)) {
               var obj = errormsgs[key];
               for (var prop in obj) {
                  if (obj.hasOwnProperty(prop)) {
                    if(prop==='message'){
                      this.toastr.error(obj[prop]);
                      //console.log(obj[prop]);
                    }
                     //console.log(prop + " = " + obj[prop]);
                  }
               }
            }
         }
        }
				else {
          console.log();
          this.toastr.error(res?.message);
        }
			},
			err => {
				//this.spinner.hide();
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
          this.toastr.success('Email verified successfully,now you can login');
					this.verifyEmailForm.reset();
					this.isVerifyEmailSubmitted = false;
          //this.setLoginScreen();
          window.location.reload();
          //this.signupCloseModal.hide();
         // $('#signupModal').find("data-dismiss=modal").click();
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
  resendOtp():void{
    this.commonservice
      .postData({email_id:this.emailtoVerify}, 'resend-otp')
      .subscribe(
        (res) => {
          // this.spinner.hide();
          if (res.status == 'success') {
            this.toastr.success('An otp has been send to your email');
          }else{
            this.toastr.error(res?.message);
          }
        },
        (err) => {
          this.toastr.error('Something went wrong, Please try again later');
        }
      );
  }
  closeSignupModal():void{
    this.signupForm?.patchValue({
      user_name: '',
      email_id:'',
      password:'',
      confirm_password:'',
      recaptcha: ''
    });
  }
  
  setLoginScreen(){
    $('#signupModal').find("data-dismiss=modal").click();
    this.loginWithinSignupModal.show();
  }

  async fetchSignupPageSettings() {
  //this.spinner.show();
  //this.isShowLoader = 1;
  await this.commonservice
  .postData('',"get-settings-data")
  .subscribe(
    (res) => {
      //this.spinner.hide();
      //this.isShowLoader = 0;
      if (res.status == "success") {
        this.signupPageSettingContent = res?.settingData;
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

togglePassword(){
  this.isShowPasswordEye = !this.isShowPasswordEye;
}
toggleConfirmPassword(){
  this.isShowConfrimPasswordEye = !this.isShowConfrimPasswordEye; 
}

}
