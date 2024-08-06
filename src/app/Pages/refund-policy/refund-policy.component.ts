import { Component, OnInit } from '@angular/core';
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.scss']
})
export class RefundPolicyComponent implements OnInit {
  cmsContent: any = [];
  isShowLoader:any=0;
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.fetchCms();
  }
  fetchCms() {
    this.spinner.show();
    this.isShowLoader = 1;
    this.commonService
    .postData(
      {cms_slug:'refund-policy'},
      "get-cms-data"
    )
    .subscribe(
      (res) => {
        this.spinner.hide();
        this.isShowLoader = 0;
        if (res.status == "success") {
          this.cmsContent = res?.page_data;
        } else {
          this.toastr.error(res?.message);
        }
      },
      (err) => {
        this.toastr.error('Something went wrong, Please try again later');
        this.spinner.hide();
        this.isShowLoader = 0;
      }
    );
  }
}