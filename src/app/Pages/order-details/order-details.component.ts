import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var window: any;
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orderId: any = '';
  orderDetails: any = [];
  orderCartitems: any = [];
  ratingForm: any = FormGroup;
  isRatingSubmitted: any = false;
  ratingCloseModal: any;
  reviewOrderId: any = '';
  isShowLoader: any = false;
  orderSubTotal:any=0;
  isOrderDetailsFound :any = false;
  public imageBaseUrl = environment?.imageBaseUrl;
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) { }
  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.params.orderId;
    this.fetchOrderDetails();
    this.activatedRoute.params?.subscribe((routeParams) => {
      this.orderId = this.activatedRoute.snapshot.params.orderId;
      this.fetchOrderDetails();
    });
    this.ratingForm = this.fb.group({
      order_id: [''],
      rating_val: ['', Validators.required],
      review_val: ['', Validators.required],
    })
    this.ratingCloseModal = new window.bootstrap.Modal(
      document.getElementById("ratingModal")
    );
  }
  fetchOrderDetails() {
    this.isShowLoader = true;
    this.spinner.show();
    this.commonService
      .postData(
        { order_id: this.orderId },
        "get-order-details"
      )
      .subscribe(
        (res) => {
          //console.log(res);
          this.spinner.hide();
          if (res.status == "success") {
            this.orderDetails = res?.order_data ?? [];
            this.isOrderDetailsFound = (this.orderDetails.order_id) ? true: false;
            //console.log(this.isOrderDetailsFound);
            let priceArr: any = [];
            let cartarray: any = [];
            let cartItems = res?.order_data?.order_items ?? [];
            let sub_total=0;
            let priceWithQtyArr:any = [];
            Object.entries(cartItems).forEach((cartIt: any, key: any) => {
              let singlePriceArr = [];
              cartarray.push(cartIt[1]?._id);
              let overallSinglePizzaPrice = 0;
              let finalOverallSinglePizzaPrice = 0;
              if (cartIt[1]?.product[0]?.selling_price == undefined || cartIt[1]?.product[0]?.selling_price === null) {
                priceArr.push(0);
                singlePriceArr.push(0);
              }
              else {
                priceArr.push(cartIt[1]?.product[0]?.selling_price);
                singlePriceArr.push(cartIt[1]?.product[0]?.selling_price);
              }
              let AddonArr = cartIt[1]?.product_addons;
              for (let AddonArrprice of AddonArr) {
                if (AddonArrprice?.addon_price == undefined || AddonArrprice?.addon_price === null) {
                  priceArr.push(0);
                  singlePriceArr.push(0);
                }
                else {
                  singlePriceArr.push(AddonArrprice?.addon_price);
                  priceArr.push(AddonArrprice?.addon_price);
                }
              }
              let AddonIngrArr = cartIt[1]?.product_ingredients;
              for (let AddonIngrprice of AddonIngrArr) {
                if (AddonIngrprice?.selling_price == undefined || AddonIngrprice?.selling_price === null) {
                  priceArr.push(0);
                  singlePriceArr.push(0);
                }
                else {
                  priceArr.push(AddonIngrprice?.selling_price);
                  singlePriceArr.push(AddonIngrprice?.selling_price);
                }
              }
              overallSinglePizzaPrice = singlePriceArr.reduce((a: number, b: number) => +a + +b, 0);
              finalOverallSinglePizzaPrice = overallSinglePizzaPrice*cartIt[1]?.qty;
              priceWithQtyArr.push(finalOverallSinglePizzaPrice);
              cartItems[key] = { ...cartIt[1], overallSinglePizzaPrice: overallSinglePizzaPrice,finalOverallSinglePizzaPrice:finalOverallSinglePizzaPrice }
            })
            sub_total = priceWithQtyArr.reduce((a: number, b: number) => +a + +b, 0);
            this.orderSubTotal = sub_total;
            this.reviewOrderId = res?.order_data?._id;
            this.ratingForm?.patchValue({
              order_id: res?.order_data?._id,
            });
            this.orderCartitems = cartItems;
            //console.log(this.orderCartitems);
          } else {
            this.toastr.error(res?.message);
          }
          this.isShowLoader = false;
        },
        (err) => {
          this.isShowLoader = false;
          //this.toastr.error('Something went wrong, Please try again later');
          this.spinner.hide();
        }
      );
  }
  get fve() {
    return this.ratingForm.controls;
  }
  ratingFormSubmit(): void {
    this.isRatingSubmitted = true;
    if (this.ratingForm.status == "VALID") {
      this.spinner.show();
      this.commonService.postData(this.ratingForm.value, "post-review").subscribe(res => {
         //this.spinner.hide();
        if (res?.status === 'success') {
          this.ratingForm.reset();
          this.ratingForm?.patchValue({
            order_id: this.reviewOrderId
          });
          this.isRatingSubmitted = false;
          this.spinner.hide();
          this.ratingCloseModal.hide();
          this.toastr.success('Review & rating submitted successfully');
        }
        else {
          this.toastr.error(res?.message);
        }
      },
        err => {
          this.spinner.hide();
          // this.toastr.error('Something went wrong, Please try again later');
        });
    }
  }
}
