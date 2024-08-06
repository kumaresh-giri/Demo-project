import { Component, OnInit,ViewChild,ElementRef } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-become-code-enforcer',
  templateUrl: './become-code-enforcer.component.html',
  styleUrls: ['./become-code-enforcer.component.scss']
})
export class BecomeCodeEnforcerComponent implements OnInit {
  applyForm: any = FormGroup;
  isSubmitted: any = false;
  applyAddress:any='';
  applyCity:any='';
  applyState:any='';
  applyZipcode:any='';
  captchaSiteKey:  string = environment?.captchaConfig?.siteKey;
  constructor(
    private router: Router,
    private commonservice: CommonService,
		private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.applyForm = this.formBuilder.group({
      user_name: ['', [Validators.required]],
      street_address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required,Validators.pattern("^[0-9]+$")]],
      phone_no: ['', [Validators.required,Validators.pattern("^[0-9]+$"),Validators.minLength(10), Validators.maxLength(15)]],
      email_add: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required,Validators.pattern("^[0-9]+$")]],
      transportation_option: ['', [Validators.required]],
      graduate: ['', [Validators.required]],
      hours_day: ['', [Validators.required]],
      position: ['', [Validators.required]],
      recaptcha: ['', Validators.required],
    });
  }
  get ApplyFcontrol() {
    return this.applyForm.controls;
  }
  applyFormSubmit() {
    this.isSubmitted = true;
		if (this.applyForm.status == "VALID") {
			this.spinner.show();
			this.commonservice.postData(this.applyForm.value, "code-enforcer-request").subscribe(res => {
				this.spinner.hide();
        if (res?.status === 'success') {
          this.toastr.success('Request submitted successfully.');
					this.applyForm.reset(); 
          this.isSubmitted = false;
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
  handleApplyAddressChange(street_address_google: any) {
    if (street_address_google.formatted_address) {
      this.applyAddress = street_address_google.formatted_address;
      street_address_google.address_components.forEach((add: any) => {
        add.types.forEach((addType: any) => {
          if (addType == "locality" || addType == "sublocality_level_1")
            this.applyCity = add.long_name===undefined?'':add.long_name;
          if (addType == "administrative_area_level_1")
            this.applyState = add.long_name===undefined?'':add.long_name;
          if (addType == "postal_code")
            this.applyZipcode = add.long_name===undefined?'':add.long_name;
        });
      });
      this.applyForm?.patchValue({
        street_address: street_address_google.formatted_address,
        city: this.applyCity,
        state: this.applyState,
        zipcode: this.applyZipcode,
      });
    }
  }
}
