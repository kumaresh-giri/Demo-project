import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var window: any;
import { ImageCroppedEvent } from "ngx-image-cropper";
@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  profilePicForm: any = FormGroup;
  profilePicFinalForm: any = FormGroup;
  profilePicCloseModal:any;
  isSubmitted: any = false;
  constructor(
    private router: Router,
    private commonservice: CommonService,
		private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.profilePicForm?.patchValue({
        profile_pic: this.croppedImage
      });
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
  ngOnInit(): void {
    /*this.profilePicCloseModal = new window.bootstrap.Modal(
      document.getElementById("profilePicModal")
    ); */
    this.profilePicForm = this.formBuilder.group({
      profile_pic: ['', [Validators.required]],
    });
    this.profilePicFinalForm = this.formBuilder.group({
      profile_pic: ['', [Validators.required]],
    });
  }
  
  get profilePicFcontrol() {
    return this.profilePicForm.controls;
  }
  closeLoginModal():void{
    this.profilePicForm?.patchValue({
      profile_pic: ''
    });
    this.profilePicFinalForm?.patchValue({
      profile_pic: ''
    });
  }
  profilePicFormSubmit() {
    this.isSubmitted = true;
		if (this.profilePicForm.status == "VALID") {
			//this.spinner.show();
    	this.commonservice.postFormDataWithToken(this.profilePicFinalForm.value, "update-profile-pic").subscribe(res => {
				//this.spinner.hide();
        if (res?.status === 'success') {
          this.toastr.success('Profile picture uploaded successfully.');
		      this.profilePicForm?.patchValue({
            profile_pic: ''
          });
          this.profilePicFinalForm?.patchValue({
            profile_pic: ''
          });
          this.isSubmitted = false;
          this.profilePicCloseModal.hide();
          this.router?.navigateByUrl('profile');
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
    else{
      //console.log('invalid');
    }
	}
}


