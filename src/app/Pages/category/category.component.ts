import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { v4 as uuidv4 } from "uuid";
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var window: any;
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  userId: any;
  signaturePizzas: any=[];
  signaturePizzaCount: any=0;
  isSubmitted: any = false;
  pageno:any=1;
  isShowLoadMore:any = 1;
  isShowLoader:any=0;
  slug:string='';
  currentSignaturePizzaPrice: any;
  currentSignaturePizzaFinalPrice: any;
  currentSignaturePizzaAddons: any = [];
  currentSignaturePizzaAddonsPrice: any = [];
  categoryAddToCartFormModal: any;
  loginModal:any;
  signupModal:any;
  modalData: any;
  wishlistFormModal: any;
  wishlistModalData: any;
  wishlistSignaturePizzaPrice: any;
  wishlistSignaturePizzaFinalPrice: any;
  wishlistSignaturePizzaAddons: any = [];
  wishlistSignaturePizzaAddonsPrice: any = [];
  isShowLoginForm:any=false;
  isShowLoginSectionForm:any=false;
  isShowSignupSectionForm:any=false;
  loginSignupModal:any;
  public apiURL = environment.apiURL;
  public imageBaseURL = environment.imageBaseUrl;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private commonservice: CommonService,
    private toastr: ToastrService,
    private actvroute:ActivatedRoute
  ) { 
    this.fetchAllSignaturePizzas();
  }

  ngOnInit(): void {
    this.userId = this.commonservice?.getUserUuid();
    this.actvroute.params.subscribe((routeParams) => {
      this.slug = this.actvroute?.snapshot?.params?.slug;
      this.fetchAllSignaturePizzas();
    });
    this.isShowLoginForm = this.commonservice.getAuthStatus();
    this.categoryAddToCartFormModal = new window.bootstrap.Modal(
      document.getElementById("categoryAddToCartFormModal")
    );
    this.wishlistFormModal = new window.bootstrap.Modal(
      document.getElementById("addWishlistItem")
    );
    this.loginSignupModal = new window.bootstrap.Modal(
      document.getElementById("loginSignupModalCategory")
    );
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

  openCategoryAddToCartFormModal(passedCartModaldata: any) {
    this.spinner.show();
    this.currentSignaturePizzaPrice = passedCartModaldata?.selling_price;
    this.currentSignaturePizzaFinalPrice = this.currentSignaturePizzaPrice;
    this.modalData = passedCartModaldata;
    this.currentSignaturePizzaAddons = [];
    this.currentSignaturePizzaAddonsPrice = [];
    setTimeout(() => {
      this.categoryAddToCartFormModal.show();
      this.spinner.hide();
    },500);
    //console.log('reach the end');
  }

  fetchAllSignaturePizzas() {
    this.slug = this.actvroute?.snapshot?.params?.slug;
    this.spinner.show();
    this.isShowLoader = 1;
    this.commonservice
      .postData(
        { pageno: this.pageno, product_type: this.slug },
        "get-product-list"
      )
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.signaturePizzaCount = res?.products?.totalDocs;
          if (res.status == "success") {
            if(this.pageno==1){
              this.signaturePizzas = res?.products?.docs;
            }
            else{
              this.signaturePizzas = [...this.signaturePizzas,...res?.products?.docs];
            }
            this.isShowLoader = 0;
            if(res?.products?.hasNextPage){
              this.isShowLoadMore = 1;
            }
            else{
              this.isShowLoadMore =0;
            }
            this.signaturePizzaCount = res?.products?.totalDocs;
          } else {
            this.isShowLoader = 0;
          }
        },
        (err) => {
          this.isShowLoader = 0;
          this.spinner.hide();
        }
      );
  }

  addCartSignaturePizza(id: any) {
    let payload = {
      user_id: this.userId,
      product_type: this.slug,
      product_id: id,
      addons: JSON.stringify(this.currentSignaturePizzaAddons),
    };
    this.spinner.show();
    this.commonservice.postData(payload, "add-to-cart").subscribe(
      (res) => {
        this.spinner.hide();
        if (res.status == "success") {
          this.currentSignaturePizzaAddons=[];
          this.toastr.success('Item added to your cart successfully');
          this.commonservice?.setAllCartItems();
        } else {
          this.toastr.error(res?.message);
        }
        this.categoryAddToCartFormModal.hide();
      },
      (err) => {
        this.spinner.hide();
        //this.toastr.error('Something went wrong, Please try again later');
      }
    );
  }

  addSignaturePizzaAddon(event: any, addonInfo: any) {
    let isChecked = event.target.checked;
    let addon_id = addonInfo?._id;
    let addon_price = addonInfo?.addon_price;
    let addonIds: any = this.currentSignaturePizzaAddons;
    let addonPrices: any = this.currentSignaturePizzaAddonsPrice;
    if (isChecked) {
      addonIds.push(addon_id);
      addonPrices.push(addon_price);
    } else {
      let index = addonIds.findIndex((x: any) => x === addon_id);
      addonIds.splice(index, 1);
      addonPrices.splice(index, 1);
    }
    let addonSum = addonPrices.reduce((a: number, b: number) => +a + +b, 0);
    let finalSum = +addonSum + +this.currentSignaturePizzaPrice;
    this.currentSignaturePizzaAddons = addonIds;
    this.currentSignaturePizzaAddonsPrice = addonPrices;
    this.currentSignaturePizzaFinalPrice = finalSum;
  }
  addSignaturePizzaAddonOnLabel(isChecked: any, addonInfo: any) {
    let addon_id = addonInfo?._id;
    let addon_price = addonInfo?.addon_price;
    let addonIds: any = this.currentSignaturePizzaAddons;
    let addonPrices: any = this.currentSignaturePizzaAddonsPrice;
    if (!isChecked) {
      addonIds.push(addon_id);
      addonPrices.push(addon_price);
    } else {
      let index = addonIds.findIndex((x: any) => x === addon_id);
      addonIds.splice(index, 1);
      addonPrices.splice(index, 1);
    }
   // console.log(addonIds);
    let addonSum = addonPrices.reduce((a: number, b: number) => +a + +b, 0);
    let finalSum = +addonSum + +this.currentSignaturePizzaPrice;
    this.currentSignaturePizzaAddons = addonIds;
    this.currentSignaturePizzaAddonsPrice = addonPrices;
    this.currentSignaturePizzaFinalPrice = finalSum;
  }

  openWishlistFormModal(passedModaldata: any) {
    

    if(this.isShowLoginForm){
      this.wishlistSignaturePizzaPrice = passedModaldata?.selling_price;
      this.wishlistSignaturePizzaFinalPrice = this.wishlistSignaturePizzaPrice;
      this.wishlistModalData = passedModaldata;
      this.wishlistSignaturePizzaAddons = [];
      this.wishlistSignaturePizzaAddonsPrice = [];
      this.wishlistFormModal.show();

    }
    else{
      this.isShowLoginSectionForm=true;
      this.isShowSignupSectionForm=false;
      window.localStorage?.setItem('lastVisitedUrl', this.router?.url);
      this.loginSignupModal.show();
    }   
  }

  addWishlistSignaturePizza(id: any) {
    let payload = {
      user_id: this.userId,
      product_type:this.slug,
      product_id: id,
      addons: JSON.stringify(this.wishlistSignaturePizzaAddons),
    };
    this.spinner.show();
    this.commonservice.postData(payload, "add-to-wishlist").subscribe(
      (res) => {
        this.spinner.hide();
        if (res.status == "success") {
          this.wishlistSignaturePizzaAddons=[];
          this.toastr.success('Item added to your wishlist successfully');
          //this.commonservice?.setAllCartItems();
        } else {
          this.toastr.error(res?.message);
        }
        this.wishlistFormModal.hide();
      },
      (err) => {
        this.spinner.hide();
        //this.toastr.error('Something went wrong, Please try again later');
      }
    );
  }

  addWishlistSignaturePizzaAddon(event: any, addonInfo: any) {
    let isChecked = event.target.checked;
    let addon_id = addonInfo?._id;
    let addon_price = addonInfo?.addon_price;
    let addonIds: any = this.wishlistSignaturePizzaAddons;
    let addonPrices: any = this.wishlistSignaturePizzaAddonsPrice;
    if (isChecked) {
      addonIds.push(addon_id);
      addonPrices.push(addon_price);
    } else {
      let index = addonIds.findIndex((x: any) => x === addon_id);
      addonIds.splice(index, 1);
      addonPrices.splice(index, 1);
    }
    let addonSum = addonPrices.reduce((a: number, b: number) => +a + +b, 0);
    let finalSum = +addonSum + +this.wishlistSignaturePizzaPrice;
    this.wishlistSignaturePizzaAddons = addonIds;
    this.wishlistSignaturePizzaAddonsPrice = addonPrices;
    this.wishlistSignaturePizzaFinalPrice = finalSum;
  }

  addWishlistSignaturePizzaAddonLabel(isChecked: any, addonInfo: any) {
    let addon_id = addonInfo?._id;
    let addon_price = addonInfo?.addon_price;
    let addonIds: any = this.wishlistSignaturePizzaAddons;
    let addonPrices: any = this.wishlistSignaturePizzaAddonsPrice;
    if (!isChecked) {
      addonIds.push(addon_id);
      addonPrices.push(addon_price);
    } else {
      let index = addonIds.findIndex((x: any) => x === addon_id);
      addonIds.splice(index, 1);
      addonPrices.splice(index, 1);
    }
    let addonSum = addonPrices.reduce((a: number, b: number) => +a + +b, 0);
    let finalSum = +addonSum + +this.wishlistSignaturePizzaPrice;
    this.wishlistSignaturePizzaAddons = addonIds;
    this.wishlistSignaturePizzaAddonsPrice = addonPrices;
    this.wishlistSignaturePizzaFinalPrice = finalSum;
  }
}
