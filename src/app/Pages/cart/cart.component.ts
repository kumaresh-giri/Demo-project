import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var window: any;
declare var $: any;
import { environment } from 'src/environments/environment';
import { NavigationStart, NavigationError, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  checkoutCloseModal:any;
  cartItemsCount: any;
  cartItems: any=[];
  cartSubTotal:any=0;
  resturaHandlingCharge:any=0;
  totalTax:any=0;
  cartNetTotal:any=0;
  userId: any;
  isShowNoResult:any=false;
  allCartItems$!: Observable<any>;
  totalCartCount$!:Observable<any>;
  cartDetails$!:Observable<any>;
  cartSubTotal$!:Observable<any>;
  cartResturaHandlingCharge$!:Observable<any>;
  cartTotalTax$!:Observable<any>;
  cartNetTotal$!:Observable<any>;
  payableAmount :any='';
  resturaHandlingAmount :any='';
  totalTaxAmout :any='';
  orderType:string = 'delivery';
  isStepOneCompleted:any = false;
  isShowLoginForm:any=false;
  isShowLoginSectionForm:any=false;
  isShowSignupSectionForm:any=false;
  showSuccess:any='';
  isSubmitted: any = false;
  addressForm: any = FormGroup;
  checkoutForm: any = FormGroup;
  userAddress: string = ''
  userLatitude: string = ''
  userLongitude: string = ''
  myprofiledata: any = [];
  restHandlingCharge:any=0;
  restTax:any=0;
  paypalClientId:any='';
  isLoggedIn :any=false;
  cartloginSignupModal:any;
  public imageBaseUrl = environment?.imageBaseUrl;
  stripePublicKey:  string = environment?.stripeConfig?.publishKey;
  // for paypal
  public payPalConfig?: IPayPalConfig;
  // for stripe
  paymentHandler:any = null;

  classToggled:any = false;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private commonservice: CommonService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) { 
    this.fetchSettingData();
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
          //do something on start activity
          //console.log('do something on start activity');
       // this.fetchSettingData();
      }
      if (event instanceof NavigationError) {
          // Handle error
         console.error(event.error);
      }

      if (event instanceof NavigationEnd) {
        this.spinner.show();
        //this.fetchSettingData();
        setTimeout(() => {
         ///this.cartSubTotal$= this.commonservice?.getCartSubTotal();
          this.commonservice?.getCartSubTotal().subscribe(
            val => { 
              this.commonservice?.setAllCartCalculation(val,this.restHandlingCharge,this.restTax);
              this.cartResturaHandlingCharge$= this.commonservice?.getCartResturaHandlingCharge();
              this.cartTotalTax$= this.commonservice?.getCartTotalTax();
              this.cartNetTotal$= this.commonservice?.getCartNetTotal();
              this.spinner.hide();
            }, //next callback
            error => { 
            //console.log("error")
            }, //error callback
            () => { 
            //console.log("Completed")
            } //complete callback
          )
        },1500);
      }
  });

  }

  ngOnInit(): void {
    this.userId = this.commonservice?.getUserUuid();
    // if(window.localStorage.getItem("userId")){
    //   this.userId = window.localStorage.getItem("userId");
    // }
    // else{
    //   const currentTimeInMilliseconds: string = uuidv4()+Date.now();
    //   window.localStorage.setItem("userId", currentTimeInMilliseconds);
    //   this.userId = window.localStorage.getItem("userId");
    // }
    this.isLoggedIn = this.commonservice?.getAuthStatus();
    this.commonservice?.setAllCartItems();
    this.allCartItems$ = this.commonservice?.getAllCartItems();
    this.totalCartCount$= this.commonservice?.getTotalCartCount();
    this.cartSubTotal$= this.commonservice?.getCartSubTotal();
    this.commonservice?.getCartSubTotal().subscribe(
      val => { 
        this.commonservice?.setAllCartCalculation(val,this.restHandlingCharge,this.restTax);
        //console.log(val) 
      }, //next callback
      error => { 
	  //console.log("error") 
	  }, //error callback
      () => { 
	  //console.log("Completed") 
	  } //complete callback
    )
    this.cartResturaHandlingCharge$= this.commonservice?.getCartResturaHandlingCharge();
    this.cartTotalTax$= this.commonservice?.getCartTotalTax();
    this.cartNetTotal$= this.commonservice?.getCartNetTotal();
    this.checkoutCloseModal = new window.bootstrap.Modal(
      document.getElementById("checkoutModal")
    );
    this.cartloginSignupModal = new window.bootstrap.Modal(
      document.getElementById("cartloginSignupModal")
    )
    this.addressForm = this.formBuilder.group({
      order_type:['delivery'],
      name: ['', Validators.required],
      //phone_no: ['', [Validators.required,Validators.pattern("^[1-9]{1}[0-9]{9}$"),Validators.minLength(10), Validators.maxLength(15)]],
      phone_no: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(15)]],
      email_id: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      lat_val: [''],
      long_val: [''],
    });
    this.checkoutForm = this.formBuilder.group({
      user_id: [''],
      sub_total: [''],
      payment_id: [''],
      payment_email: [''],
      grand_total: [''],
      payment_amount: [''],
      resturant_handling_charge:[],
      total_tax:[],
      order_type: [''],
      address: [''],
      lat_val: [''],
      long_val: [''],
      del_phone: [''],
      del_email: [''],
      del_name: [''],
      cart_ids: [''],
    });
    if(this.isLoggedIn){
      this.isShowLoginForm=false;
      this.fetchMyAccount();
    }
    else{
      this.isShowLoginForm=true;
    }
    this.invokeStripe();
  }

  async fetchSettingData(){
    await this.commonservice.postData('',"get-settings-data")
    .subscribe(
      (res) => {
        if (res.status == "success") {
          this.restHandlingCharge=res?.settingData?.resturant_handling_charge;
          this.restTax=res?.settingData?.vat_amount;
          this.paypalClientId =res?.settingData?.paypal_client_id;
        } else {
          // this.toastr.error(res?.message);
        }
      },
      (err) => {
        this.toastr.error('Something went wrong, Please try again later');
      }
    );
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
            this.commonservice.getHeaderAddressLatLong().subscribe((data: any) => {
              if(data){
                this.addressForm?.patchValue({
                  name: this.myprofiledata?.user_name,
                  email_id: this.myprofiledata?.email_id,
                  phone_no: this.myprofiledata?.phone_no,
                  address: data?.address,
                  lat_val: data?.addressLat,
                  long_val: data?.addressLong,
                });
              }
              else{
                this.addressForm?.patchValue({
                  name: this.myprofiledata?.user_name,
                  email_id: this.myprofiledata?.email_id,
                  phone_no: this.myprofiledata?.phone_no,
                  address: window.localStorage.getItem("homeAddress"),
                  lat_val: window.localStorage.getItem("homeLat"),
                  long_val: window.localStorage.getItem("homeLong"),
                });
              }
            });
          } else {
            //this.toastr.error(res?.message);
          }
        },
        (err) => {
          this.spinner.hide();
          //this.toastr.error('Something went wrong, Please try again later');
        }
      );
  }
  setOrderType(event:any):void{
    var selectEl = event.target;
    var orderType = selectEl.options[selectEl.selectedIndex].value;
    this.orderType = orderType;
    if(orderType=== 'delivery'){
      this.addressForm?.patchValue({
        address: window.localStorage.getItem("homeAddress")
      });
      this.addressForm.get('address').setValidators([ Validators.required ]);
    } else {  
      this.addressForm?.patchValue({
        address: ''
      });
      this.addressForm.get('address').clearValidators();              
    }
    this.addressForm.get('address').updateValueAndValidity();
  }

  setCheckoutprice():void{
    let payableAmount = this.commonservice.getPayableAmount();
    let checkoutCartItems = this.commonservice.getCheckoutCartItems();
    //payableAmount = 0.02;

    payableAmount = Math.round(payableAmount);

    this.payPalConfig = {
      currency: 'USD',
      clientId: this.paypalClientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: payableAmount,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: payableAmount
                }
              }
            },
            items: []
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        //console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details:any) => {
          //console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        //console.log(checkoutCartItems);
        let cartitem = [];
        let sub_total = this.checkoutForm.controls['sub_total'].value;
        let grand_total = this.checkoutForm.controls['grand_total'].value;
        let payment_amount = this.checkoutForm.controls['payment_amount'].value;
        //cartitem.push('62e2d45d5ae3c42751e19b25');
        let payload = {
          user_id: this.userId,
          sub_total: sub_total.toFixed(2),
          payment_id: data.id,
          payment_email: data?.payer?.email_address,
          grand_total: grand_total.toFixed(2),
          payment_amount: payment_amount.toFixed(2),
          order_type: 'delivery',
          //order_type: this.checkoutForm.controls['order_type'].value,
          address: this.checkoutForm.controls['address'].value,
          lat_val: this.checkoutForm.controls['lat_val'].value,
          long_val: this.checkoutForm.controls['long_val'].value,
          del_phone: this.checkoutForm.controls['del_phone'].value,
          del_email: this.checkoutForm.controls['del_email'].value,
          del_name: this.checkoutForm.controls['del_name'].value,
          cart_ids: JSON.stringify(this.checkoutForm.controls['cart_ids'].value)
        };
       //console.log(payload);
        this.checkoutForm?.patchValue({
          payment_id:data.id,
          payment_email:data?.payer?.email_address,
        });
        this.spinner.show();
        this.commonservice.postData(payload, "create-order").subscribe(
        (res) => {
          this.spinner.hide();
          if (res.status == "success") {
            this.toastr.success('order placed successfully');
            this.checkoutCloseModal.hide();
            this.checkoutForm.reset();
            this.commonservice?.setAllCartItems();
            this.router.navigate(['/payment-success/'+res?.orderdata?._id+'/'+res?.orderdata?.order_id]);
          } else {
            this.toastr.error(res?.message);
          }
        },
        (err) => {
          this.spinner.hide();
          //this.toastr.error('Something went wrong, Please try again later');
        }
      );
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        //console.log('OnCancel', data, actions);
      },
      onError: err => {
        //console.log('OnError', err);
      },
      onClick: (data, actions) => {
        //console.log('onClick', data, actions);
      },
    };
  }

  deleteCart(id : any){
    this.spinner.show();
    this.commonservice
      .postData({ cart_item_id:id}, 'delete-cart')
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.status == 'success') {
            this.commonservice?.setAllCartItems();
            this.toastr.success('Item has been removed from cart');
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

  get f() {
    return this.addressForm.controls;
  }

  addressSubmit():void{
    //this.setCheckoutprice();
    
    this.isSubmitted = true;
    if (this.addressForm.status == 'VALID') {

      this.spinner.show();
      let payableAmount = this.commonservice.getPayableAmount();
      let checkoutCartItems = this.commonservice.getCheckoutCartItems();
      let lat_val = this.userLatitude;
      let long_val = this.userLongitude;
      let address = this.userAddress;
      this.commonservice.getCartResturaHandlingCharge().subscribe((data: any) => {
        this.resturaHandlingAmount =data;
  
      });
      this.commonservice.getCartTotalTax().subscribe((data: any) => {
        this.totalTaxAmout =data;
      });
      if(this.resturaHandlingAmount){
        this.isStepOneCompleted = true;
        if(this.isSubmitted){
          this.makePayment(payableAmount);
        }
        this.isSubmitted = false;
        //this.makePayment(payableAmount);
        this.checkoutCloseModal.hide();
        

        // getCartResturaHandlingCharge():Observable<any> {
        //   return this.cartResturaHandlingCharge?.asObservable();
        // }
        // getCartTotalTax():Observable<any> {
        //   return this.cartTotalTax?.asObservable();
        // }
      
        this.checkoutForm?.patchValue({
          user_id:this.userId,
          sub_total:payableAmount,
          grand_total:payableAmount,
          resturant_handling_charge:this.resturaHandlingAmount,
          total_tax:this.totalTaxAmout,
          payment_amount:payableAmount,
          del_name: this.addressForm.controls['name'].value,
          del_phone: this.addressForm.controls['phone_no'].value,
          del_email: this.addressForm.controls['email_id'].value,
          address: address,
          //order_type: this.addressForm.controls['order_type'].value,
          order_type:'delivery',
          lat_val: lat_val,
          long_val: long_val,
          cart_ids:checkoutCartItems
        });
        setTimeout(() => {

          //this.checkoutCloseModal.show();
          this.spinner.hide();
        },1500);
      }
      else{
        window.location.reload();
      }
      
      //this.spinner.hide();
    }
  }

  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address
    this.userLatitude = address.geometry.location.lat()
    this.userLongitude = address.geometry.location.lng()
    this.checkoutForm?.patchValue({
      address:address?.formatted_address,
      lat_val:address?.geometry?.location?.lat(),
      long_val:address?.geometry?.location?.lng(),
    });
  }

  setCheckoutUserDetails() {
    this.cartResturaHandlingCharge$= this.commonservice?.getCartResturaHandlingCharge();
    this.cartTotalTax$= this.commonservice?.getCartTotalTax();
    this.cartNetTotal$= this.commonservice?.getCartNetTotal();
    this.commonservice.getHeaderAddressLatLong().subscribe((data: any) => {
      // this.addressForm?.patchValue({
      //         name: this.myprofiledata?.user_name,
      //         email_id: this.myprofiledata?.email_id,
      //         phone_no: this.myprofiledata?.phone_no,
      //         address: data?.address,
      //         lat_val: data?.addressLat,
      //         long_val: data?.addressLong,
      //       });
    });
  }
  setloginSignup(type:any=0){
    if(type==1){
      this.isShowLoginSectionForm=false;
      this.isShowSignupSectionForm=true;
    }
    else{
      this.isShowLoginSectionForm=true;
      this.isShowSignupSectionForm=false;
    }
  }

  initLogin() {
    this.isShowLoginSectionForm = true;
    this.isShowSignupSectionForm = false;
    this.cartloginSignupModal.show();
  }

  invokeStripe() {
    let self=this;
    if(!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "https://checkout.stripe.com/checkout.js";
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: self.stripePublicKey,
          locale: 'auto',
          token: function (stripeToken: any) {
           // console.log(stripeToken)
          //  alert('Payment has been successfull!');
          }
        });
      }
         
      window.document.body.appendChild(script);
    }
  }
  makePayment(amount:any) {
    let self=this;
    let final_amount = amount.toFixed(2);
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: self.stripePublicKey,
      locale: 'auto',
      token: function (stripeToken: any) {
       // console.log(stripeToken)
        //alert('Stripe token generated!');

        let cartitem = [];
        let sub_total = self.checkoutForm.controls['sub_total'].value;
        let grand_total = self.checkoutForm.controls['grand_total'].value;
        let payment_amount = self.checkoutForm.controls['payment_amount'].value;
        //payment_amount = Math.ceil(payment_amount);
        //cartitem.push('62e2d45d5ae3c42751e19b25');
        let payload = {
          user_id: self.userId,
          sub_total: sub_total.toFixed(2),
          payment_id: stripeToken?.id,
          payment_email: stripeToken?.email,
          card_token: stripeToken?.id,
          grand_total: grand_total.toFixed(2),
          payment_amount: payment_amount.toFixed(2),
          order_type: 'delivery',
          resturant_handling_charge:self.resturaHandlingAmount,
          total_tax:self.totalTaxAmout,
          //order_type: self.checkoutForm.controls['order_type'].value,
          address: self.checkoutForm.controls['address'].value,
          lat_val: self.checkoutForm.controls['lat_val'].value,
          long_val: self.checkoutForm.controls['long_val'].value,
          del_phone: self.checkoutForm.controls['del_phone'].value,
          del_email: self.checkoutForm.controls['del_email'].value,
          del_name: self.checkoutForm.controls['del_name'].value,
          cart_ids: JSON.stringify(self.checkoutForm.controls['cart_ids'].value)
        };
       //console.log(payload);
        self.checkoutForm?.patchValue({
          payment_id:stripeToken.id,
          payment_email:stripeToken?.email,
        });
        self.spinner.show();
        self.commonservice.postData(payload, "create-order").subscribe(
        (res:any) => {
          self.spinner.hide();
          if (res.status == "success") {
            self.toastr.success('order placed successfully');
            self.checkoutCloseModal.hide();
            self.checkoutForm.reset();
            self.commonservice?.setAllCartItems();
            self.router.navigate(['/payment-success/'+res?.orderdata?._id+'/'+res?.orderdata?.order_id]);
          } else {
            self.toastr.error(res?.message);
          }
        },
        (err:any) => {
          self.spinner.hide();
          //self.toastr.error('Something went wrong, Please try again later');
        }
      );
        self.showSuccess = true;

      }
    });
        paymentHandler.open({
          name: 'Code Red Pizza',
          description: 'Your pizzas',
          email:self.addressForm.controls['email_id'].value,
          amount: final_amount * 100,
          closed: ()=>{this.doSomethingWhenStripePopUpCloses();} 
        });

    
    
  }

  doSomethingWhenStripePopUpCloses(){
    $('body').css('overflow','auto');
  }

  increaseQuantity(item:any){
    let qty = item?.qty;
    let newqty =+qty+1;
    this.spinner.show();
    let payload = {
      cart_item_id:item?._id,
      cart_qty:newqty
    }
    this.spinner.show();
    this.commonservice.postData(payload, "update-cart-qty").subscribe(
    (res:any) => {
      //console.log(res);
      this.spinner.hide();
      if (res.status == "success") {
        this.toastr.success("Cart quantity has been updated successfully");
        this.commonservice?.setAllCartItems();

        this.allCartItems$ = this.commonservice?.getAllCartItems();
        this.totalCartCount$= this.commonservice?.getTotalCartCount();
        this.cartSubTotal$= this.commonservice?.getCartSubTotal();
        this.commonservice?.getCartSubTotal().subscribe(
          val => { 
            this.commonservice?.setAllCartCalculation(val,this.restHandlingCharge,this.restTax);
            //console.log(val) 
          }, //next callback
          error => { 
        //console.log("error") 
        }, //error callback
          () => { 
        //console.log("Completed") 
        } //complete callback
        )
        this.cartResturaHandlingCharge$= this.commonservice?.getCartResturaHandlingCharge();
        this.cartTotalTax$= this.commonservice?.getCartTotalTax();
        this.cartNetTotal$= this.commonservice?.getCartNetTotal();

        // this.checkoutCloseModal.hide();
        // this.checkoutForm.reset();
        // this.commonservice?.setAllCartItems();
        // this.router.navigate(['/payment-success/'+res?.orderdata?._id+'/'+res?.orderdata?.order_id]);
      } else {
        this.toastr.error(res?.message);
      }
    },
    (err:any) => {
      this.spinner.hide();
      //this.toastr.error('Something went wrong, Please try again later');
    }
  );
  

  }
  decreaseQuantity(item:any){
    let qty = item?.qty;
    let newqty =+qty-1;
    if(newqty>=1){
      this.spinner.show();
      let payload = {
        cart_item_id:item?._id,
        cart_qty:newqty
      }
      this.commonservice.postData(payload, "update-cart-qty").subscribe(
        (res:any) => {
          //console.log(res);
          this.spinner.hide();
          if (res.status == "success") {
            this.toastr.success("Cart quantity has been updated successfully");
            this.commonservice?.setAllCartItems();
    
            this.allCartItems$ = this.commonservice?.getAllCartItems();
            this.totalCartCount$= this.commonservice?.getTotalCartCount();
            this.cartSubTotal$= this.commonservice?.getCartSubTotal();
            this.commonservice?.getCartSubTotal().subscribe(
              val => { 
                this.commonservice?.setAllCartCalculation(val,this.restHandlingCharge,this.restTax);
                //console.log(val) 
              }, //next callback
              error => { 
            //console.log("error") 
            }, //error callback
              () => { 
            //console.log("Completed") 
            } //complete callback
            )
            this.cartResturaHandlingCharge$= this.commonservice?.getCartResturaHandlingCharge();
            this.cartTotalTax$= this.commonservice?.getCartTotalTax();
            this.cartNetTotal$= this.commonservice?.getCartNetTotal();
          } else {
            this.toastr.error(res?.message);
          }
        },
        (err:any) => {
          this.spinner.hide();
          //this.toastr.error('Something went wrong, Please try again later');
        }
      );
    }
    else{
      this.deleteCart(item?._id);
      //this.toastr.error('Minimum quantity must be one');
    }
    //console.log(newqty);
    //this.spinner.show();
    
  }

  public toggleField() {
    this.classToggled = !this.classToggled;  
  }
  
}







