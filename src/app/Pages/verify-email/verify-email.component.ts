import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var window: any;
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  isVerifyEmailSubmitted:any=false;
  verifyEmailForm:any=FormGroup;
  signupCloseModal:any;
  constructor(
    private commonservice: CommonService,
		private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.signupCloseModal = new window.bootstrap.Modal(
      document.getElementById("signupModal")
    );
    // verify email form validation condition
    this.verifyEmailForm = this.formBuilder.group({
      email_id: [''],
      otp: ['', [Validators.required]],
    });
  }
  // to verify verify email form control
  get fve() {
    return this.verifyEmailForm.controls;
  }
  verifyEmailFormSubmit() {
		this.isVerifyEmailSubmitted = true;
		if (this.verifyEmailForm.status == "VALID") {
			//this.spinner.show();
			this.commonservice.postData(this.verifyEmailForm.value, "verify-email").subscribe(res => {
				//this.spinner.hide();
        if (res.status === 'success') {
          this.toastr.success('Email verified successfully');
					//this.commonservice.showSuccess(res.message, "Signup")
					this.verifyEmailForm.reset();
					this.isVerifyEmailSubmitted = false;
          this.signupCloseModal.hide();
        }
				else {
          this.toastr.error(res?.message);
					//let errors = res.error;
					//for (let error of errors) {
						//this.commonservice.showError(error, "Signup")
					//}
				//	this.commonservice.showWarning(res.message, "Signup")
				}
			},
			err => {
				this.spinner.hide();
				//this.commonservice.showError(err.message, "Signup")
			});
		}
	}

}
