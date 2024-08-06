import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  myprofiledata: any = [];
  isSubmitted: any = false;
  isLoggedIn :any=false;
  editProfileForm: FormGroup = new FormBuilder()?.group({
    user_name: ['', Validators.required],
    email_id: [''],
    //phone_no: ['', [Validators.required,Validators.pattern("^[1-9]{1}[0-9]{9}$"),Validators.minLength(10), Validators.maxLength(10)]],
    phone_no: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(10)]],
  });
  updateProfileForm: FormGroup = new FormBuilder()?.group({
    user_name: ['', Validators.required],
    phone_no: ['', Validators.required]
  });
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private commonservice: CommonService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
	this.isLoggedIn = this.commonservice?.getAuthStatus();
	 if(this.isLoggedIn){
      this.fetchMyAccount();
    }
    //this.fetchMyAccount();
  }
  fetchMyAccount() {
    this.spinner.show();
    this.commonservice
      .postDataRaw('',"get-account")
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.status == "success") {
            this.myprofiledata = res?.userdata;
            this.editProfileForm?.patchValue({
              user_name: res?.userdata?.user_name,
              email_id: res?.userdata?.email_id,
              phone_no: res?.userdata?.phone_no
            });
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
  get f() {
    return this.editProfileForm.controls;
  }
  updateProfileSubmit():void{
    this.isSubmitted = true;
    if (this.editProfileForm.status == "VALID") {
      this.updateProfileForm?.patchValue({
        user_name: this.editProfileForm.controls['user_name'].value,
        phone_no: this.editProfileForm.controls['phone_no'].value
      });
      this.commonservice
        .postFormDataWithToken(this.updateProfileForm.value, 'update-account-data')
        .subscribe(
          (res) => {
          // this.spinner.hide();
            if (res.status == 'success') {
              this.router?.navigateByUrl('dashboard');
              this.toastr.success('Your profile has been updated successfully');
              this.isSubmitted = false;
            }else{
              this.toastr.error(res?.message);
            }
          },
          (err) => {
            this.spinner.hide();
            //this.toastr.error('Something went wrong, Please try again later');
          }
        );
      }   
  }
}
