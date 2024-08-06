import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/validator/CustomValidators';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  myprofiledata: any = [];
  isSubmitted: any = false;
  changePasswordForm: any = FormGroup;
  isShowPasswordEye: any = false;
  isShowConfrimPasswordEye: any = false;
  isFromFooterLoginReq:any = false;
  constructor(
    private router: Router,
    private commonservice: CommonService,
		private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: [
        '',
        [Validators.required],
      ],
    },
    {
      validator: CustomValidators.mustMatch('password', 'confirm_password'),
    });
 }
  // to verify submit form
  get f() {
    return this.changePasswordForm.controls;
  }
  updatePasswordSubmit():void{
    this.isSubmitted = true;
    if (this.changePasswordForm.status == "VALID") {
      this.commonservice
      .postFormDataWithToken(this.changePasswordForm.value, 'update-account-password')
      .subscribe(
        (res) => {
          if(res.status == 'success') {
            this.router?.navigateByUrl('dashboard');
            this.toastr.success('Your profile has been updated successfully');
            this.isSubmitted = false;
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
  }
  togglePassword(){
    this.isShowPasswordEye = !this.isShowPasswordEye;
  }
  
  
  toggleConfirmPassword(){
    this.isShowConfrimPasswordEye = !this.isShowConfrimPasswordEye; 
  }
}


