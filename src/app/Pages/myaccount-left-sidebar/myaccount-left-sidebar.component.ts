import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from "ngx-image-cropper";
import { environment } from 'src/environments/environment';
declare var window: any;
declare var $: any;

@Component({
  selector: 'app-myaccount-left-sidebar',
  templateUrl: './myaccount-left-sidebar.component.html',
  styleUrls: ['./myaccount-left-sidebar.component.scss']
})
export class MyaccountLeftSidebarComponent implements OnInit {
  myprofiledata: any = [];
  newsLetterStatus:any='';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  profilePicForm: any = FormGroup;
  profilePicFinalForm: any = FormGroup;
  profilePicCloseModal:any;
  isSubmitted: any = false;
  isShowProfileImage:any=false;
   isLoggedIn :any=false;
   profilePicModal:any;
  public imageBaseUrl = environment?.imageBaseUrl;
  @ViewChild('takeprofilepicInput') fileInput!: ElementRef;
 
  constructor(
    private router: Router,
    private commonservice: CommonService,
		private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.commonservice?.getAuthStatus();
	  this.profilePicCloseModal = new window.bootstrap.Modal(
      document.getElementById("profilePicModal")
    ); 
    this.profilePicForm = this.formBuilder.group({
      profile_pic: ['', [Validators.required]],
    });
    this.profilePicFinalForm = this.formBuilder.group({
      profile_pic: ['', [Validators.required]],
    });
	 if(this.isLoggedIn){
      this.fetchMyAccount();
    }
    
	
  }

  
  async fetchMyAccount() {
    this.spinner.show();
    await this.commonservice
      .postDataRaw('',"get-account")
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.status == "success") {
            this.myprofiledata = res?.userdata;
          } else {
            this.toastr.error(res?.message);
          }
        },
        (err) => {
          this.spinner.hide();
          //this.toastr.error('Something went wrong, Please try again later');
        }
      );
  }
  changeNewsletterStatus(event: any):void{
    let isChecked = event.target.checked;
    if (isChecked) {
      this.newsLetterStatus ='active';
      //addonPrices.push(addon_price);
    } else {
      this.newsLetterStatus ='inactive';
    }
    this.spinner.show();
    this.commonservice.postFormDataWithToken({newsletter_status:this.newsLetterStatus}, "update-sub-newsletter").subscribe(
      (res) => {
          this.spinner.hide();
          if (res.status == "success") {
          this.toastr.success('Newletter change request has been submitted successfully');
          this.fetchMyAccount();
        } else {
          this.toastr.error(res.msg);
        }
      },
      (err) => {
        this.spinner.hide();
        //this.toastr.error('Something went wrong, Please try again later');
      }
    );
  }

  
 
  fileChangeEvent(event: any): void {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      //console.log(file);
        if(file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png" ) {
          //console.log("correct");
          this.imageChangedEvent = event;
          this.isShowProfileImage=true;
        }
        else {
          
          this.fileInput.nativeElement.value = "";
          this.profilePicForm?.patchValue({
            profile_pic: ''
          });
          this.profilePicFinalForm?.patchValue({
            profile_pic: ''
          });
         // this.profilePicForm.reset();
          //this.profilePicForm.controls["profile_pic"].setValidators([Validators.required]);
          //this.profilePicForm.get('imageInput').updateValueAndValidity();
          //call validation
         // this.registerForm.reset();
        //  this.registerForm.controls["imageInput"].setValidators([Validators.required]);
         // this.registerForm.get('imageInput').updateValueAndValidity();
        }
    }



    // const reader = new FileReader();
    
    // if(event.target.files && event.target.files.length) {
    //   const [file] = event.target.files;
    //   reader.readAsDataURL(file);
    
    //   reader.onload = () => {
   
    //     // this.imageSrc = reader.result as string;
     
    //     // this.myForm.patchValue({
    //     //   fileSource: reader.result
    //     // });
   
    //   };
   
    // }


    
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //this.fileInput.nativeElement.value = "";
    this.profilePicFinalForm?.patchValue({
      profile_pic: this.croppedImage
    });
  }
  imageLoaded() {
      /* show cropper */
  }
  cropperReady() {
      /* cropper ready */
  }
  loadImageFailed() {
      /* show message */
  }
  
  
  get profilePicFcontrol() {
    return this.profilePicForm.controls;
  }
  
  async profilePicFormSubmit() {
   
    //this.loginCloseModal.hide();
    this.isSubmitted = true;
		if (this.profilePicForm.status == "VALID") {
			this.spinner.show();
    await 	this.commonservice.postFormDataWithToken(this.profilePicFinalForm.value, "update-profile-pic").subscribe(res => {
				//this.spinner.hide();
        if (res?.status === 'success') {
          setTimeout(() => {
            //this.profilePicCloseModal.hide();
           // this.spinner.hide();
            this.fetchMyAccount();
            //this.toastr.success('Profile picture uploaded successfully.');
          },100);
          
          this.profilePicForm?.patchValue({
            profile_pic: ''
          });
          this.profilePicFinalForm?.patchValue({
            profile_pic: ''
          });
          this.isSubmitted = false;
          setTimeout(() => {
            this.profilePicCloseModal.hide();
            this.spinner.hide();
            this.toastr.success('Profile picture uploaded successfully.');
          },1000);
        }
				else{
          this.spinner.hide();
          this.toastr.error(res?.message);
          this.isSubmitted = false;
        }
			},
			err => {
				this.spinner.hide();
        this.isSubmitted = false;
        //this.toastr.error('Something went wrong, Please try again later');
      });
		}
    else{
      //this.toastr.error('Something went wrong, Please try again later');
    }
	}
  closeProfilePicModal():void{
    this.isShowProfileImage=false;
    this.fileInput.nativeElement.value = "";
    this.profilePicForm?.patchValue({
      profile_pic: ''
    });
    this.profilePicFinalForm?.patchValue({
      profile_pic: ''
    });
  }

  initEditProfile() {
    this.isShowProfileImage=false;
    this.fileInput.nativeElement.value = "";
    this.profilePicForm?.patchValue({
      profile_pic: ''
    });
    this.profilePicFinalForm?.patchValue({
      profile_pic: ''
    });
    this.profilePicCloseModal.show();
  }

}
