import { Component, OnInit } from '@angular/core';
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  orderId: any;
  orderNo: any;
  PaymentSuccessForm: any = FormGroup;
  orderSuccessDetails: any = [];
  constructor(
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params.id;
    this.orderNo = this.route.snapshot.params.orderno;
    //console.log(this.route.snapshot.params.id);
    this.PaymentSuccessForm = this.formBuilder.group({
      order_id: this.route.snapshot.params.id,
      order_no: this.route.snapshot.params.orderno,
    });
    this.fetchPaymentSuccessDetails();
    this.activatedRoute.params?.subscribe((routeParams) => {
      this.orderId = this.route.snapshot.params.id;
      this.orderNo = this.route.snapshot.params.orderno;
      //this.fetchPaymentSuccessDetails();
    });
  }
  fetchPaymentSuccessDetails() {
    this.spinner.show();
    this.commonService
    .postData(
      {order_id:this.orderId },
      "get-order-details"
    )
    .subscribe(
      (res) => {
        this.spinner.hide();
        if (res.status == "success") {
          this.orderSuccessDetails = res?.order_data;
          } else {
           this.toastr.error(res?.message);
        }
      },
      (err) => {
        //this.toastr.error('Something went wrong, Please try again later');
        this.spinner.hide();
      }
    );
  }
 

}
