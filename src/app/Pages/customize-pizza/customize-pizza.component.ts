import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
//import PaginationOptions from "src/app/models/PaginationOptions";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { v4 as uuidv4 } from "uuid";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as Global from 'src/app/global';
import { Observable, of } from 'rxjs';
declare var window: any;
declare var $: any;
import { ActivatedRoute } from '@angular/router';
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
//import { TooltipModule  } from 'ngx-bootstrap/tooltip';

@Component({
  selector: "app-customize-pizza",
  templateUrl: "./customize-pizza.component.html",
  styleUrls: ["./customize-pizza.component.scss"],
})

export class CustomizePizzaComponent implements OnInit {
  Global = Global;
  formModal: any;
  modalData: any;
  //paginationOptions: PaginationOptions;
  signaturePizzas: any=[];
  signaturePizzaCount: any;
  customizedPizzas: any;
  customizedPizzaCount: any;
  wishlistFormModal: any;
  signaturePizzaForm: any;
  wishlistModalData: any;
  wishlistSignaturePizzaPrice: any;
  wishlistSignaturePizzaFinalPrice: any;
  wishlistSignaturePizzaAddons: any = [];
  wishlistSignaturePizzaAddonsPrice: any = [];
  cartItemsCount: any;
  cartItems: any;
  selectedItemsList = [];
  checkedIDs: any[] = [];
  userId: any;
  cartProducts: any;
  currentSignaturePizzaPrice: any;
  currentSignaturePizzaFinalPrice: any;
  currentSignaturePizzaAddons: any = [];
  currentSignaturePizzaAddonsPrice: any = [];
  currentCustomizedPizzaAddons: any = [];
  currentSignaturePizzaInstructions: any = '';
  defaultCustomizedPizzaSelectedId:any='';
  currentCustomizedPizzaSelectedId:any='';
  radioCustomizedPizzaSelectedIds:any=[];
  radioforCustomizedPizzaSelectedId:any=[];
  currentCustomizedPizzaSelectedPrice:any='';
  currentCustomizedPizzaAddonsPrice: any = [];
  defaultCategory:any='';
  isSubmitted: any = false;
  pageno:any=1;
  isShowLoadMore:any = 1;
  isShowLoader:any=0;
  whetherSignCustomizedPizaaTab$!: Observable<any>;
  public apiURL = environment.apiURL;
  public imageBaseURL = environment.imageBaseUrl;
  customizedPizzaForm:any=FormGroup;
  isShowLoginSectionForm:any=true;
  isShowSignupSectionForm:any=false;
  loginSignupModal:any;
  isShowLoginForm:any=true;
  customSignaturePizzaTab:any='';
  constructor(
    //private socialAuthService: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private commonservice: CommonService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private actvroute:ActivatedRoute
  ) {
    //this.paginationOptions = Global.resetPaginationOption();
  }

  ngOnInit(): void {
    this.whetherSignCustomizedPizaaTab$= this.commonservice?.getSignCustomizedPizaaTab(); 
    this.actvroute.params.subscribe((routeParams) => {
      this.customSignaturePizzaTab = this.actvroute?.snapshot?.params?.slug;
      if(this.customSignaturePizzaTab==='signature'){
        this.commonservice.setSignCustomizedPizaaTab('signature');
      }
      else if(this.customSignaturePizzaTab==='custom'){
        this.commonservice.setSignCustomizedPizaaTab('custom');
      }
    });
    this.whetherSignCustomizedPizaaTab$= this.commonservice?.getSignCustomizedPizaaTab(); 
    this.fetchAllSignaturePizzas();
    this.fetchAllCustomizedPizza();
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("addItem")
    );
    this.wishlistFormModal = new window.bootstrap.Modal(
      document.getElementById("addWishlistItem")
    );
    this.loginSignupModal = new window.bootstrap.Modal(
      document.getElementById("loginSignupModalCustomize")
    );
    this.customizedPizzaForm =  this.formBuilder.group({
			//product_id:['', [Validators.required]],
      product_name: ['', [Validators.required]],
			ingredientId: ['', [Validators.required]],
      ingredientPrice: [''],
		})
    this.signaturePizzaForm =  this.formBuilder.group({
			specialInstructions: [''],
		})
    this.userId = this.commonservice?.getUserUuid();
    this.isShowLoginForm = this.commonservice.getAuthStatus();
  }
  get customFcontrol() {
    return this.customizedPizzaForm.controls;
  }
  setSigntaureCustomPizzaTab(data:any):void{
    this.commonservice.setSignCustomizedPizaaTab(data);
  }

  openFormModal(passedModaldata: any) {
    //console.log('openFormModal');
    this.spinner.show();
    this.currentSignaturePizzaPrice = passedModaldata?.selling_price;
    this.currentSignaturePizzaFinalPrice = this.currentSignaturePizzaPrice;
    this.modalData = passedModaldata;
    this.currentSignaturePizzaAddons = [];
    this.currentSignaturePizzaAddonsPrice = [];
    this.signaturePizzaForm.reset(); 
    //this.currentSignaturePizzaInstructions ='';
    //this.currentSignaturePizzaInstructions.setValue('');
    setTimeout(() => {
      this.formModal.show();
      this.spinner.hide();
    },500);
    //this.formModal.show();
  }
  async fetchAllCustomizedPizza(page: any = null) {
    // if (page != null) {
    //   this.paginationOptions.page = page;
   // }
    this.spinner.show();
    await this.commonservice
    .postData(
      { pageno: 1 },
      "get-category-product-list"
    )
    .subscribe(
      (res) => {
        this.spinner.hide();
        if (res.status == "success") {
          this.customizedPizzas = res.products.docs;
          this.customizedPizzaCount = res.products.totalDocs;
          for (let [key, value] of Object.entries(this.customizedPizzas)) {
            if(this.customizedPizzas[key]?.cat_product_type==='radio' && this.customizedPizzas[key]?.show_price==='yes'){
              this.radioCustomizedPizzaSelectedIds.push({'cat_name':this.customizedPizzas[key]?.category_name,'product_addon_id':this.customizedPizzas[key]?.products[0]?._id});
              this.defaultCategory = this.customizedPizzas[key]?.category_name;
              this.radioforCustomizedPizzaSelectedId=[this.customizedPizzas[key]?.products[0]?._id];
              this.defaultCustomizedPizzaSelectedId=this.customizedPizzas[key]?.products[0]?._id;
              this.currentCustomizedPizzaSelectedId=this.customizedPizzas[key]?.products[0]?._id;
              this.currentCustomizedPizzaSelectedPrice=this.customizedPizzas[key]?.products[0]?.selling_price;
              break;
            }
          }
          this.customizedPizzaForm?.patchValue({
            ingredientId: this.currentCustomizedPizzaSelectedId,
            ingredientPrice: this.currentCustomizedPizzaSelectedPrice,
          });
        } else {
         // this.paginationOptions = Global.resetPaginationOption();
        }
      },
      (err) => {
        //this.paginationOptions = Global.resetPaginationOption();
        this.spinner.hide();
      }
    );
  }

  fetchAllSignaturePizzas(page: any = null) {
    // if (page != null) {
    //   this.paginationOptions.page = page;
    // }
    this.spinner.show();
    this.isShowLoader = 1;
    this.commonservice
      .postData(
        { pageno: this.pageno, product_type: "signature" },
        "get-product-list"
      )
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.status == "success") {
            this.signaturePizzas = [...this.signaturePizzas,...res?.products?.docs];
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
           // this.paginationOptions = Global.resetPaginationOption();
          }
        },
        (err) => {
          this.isShowLoader = 0;
         // this.paginationOptions = Global.resetPaginationOption();
          this.spinner.hide();
        }
      );
    setTimeout(() => {});
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
    //console.log(addonIds);
    let addonSum = addonPrices.reduce((a: number, b: number) => +a + +b, 0);
    let finalSum = +addonSum + +this.currentSignaturePizzaPrice;
    this.currentSignaturePizzaAddons = addonIds;
    this.currentSignaturePizzaAddonsPrice = addonPrices;
    this.currentSignaturePizzaFinalPrice = finalSum;
  }

  addCartSignaturePizza(id: any) {
    let payload = {
      user_id: this.userId,
      product_type: "signature",
      product_id: id,
      special_instruction: (this.signaturePizzaForm.controls['specialInstructions'].value) ? this.signaturePizzaForm.controls['specialInstructions'].value: '',
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
        this.formModal.hide();
      },
      (err) => {
        this.spinner.hide();
        //this.toastr.error('Something went wrong, Please try again later');
      }
    );
    setTimeout(() => {});
  }

  addCustomisedPizzaAddon(event: any, addonInfo: any) {
    let isChecked = event.target.checked;
    let addon_id = addonInfo?._id;
    let addonIds: any = this.currentCustomizedPizzaAddons;
    if (isChecked) {
      addonIds.push(addon_id);
    } else {
      let index = addonIds.findIndex((x: any) => x === addon_id);
      addonIds.splice(index, 1);
    }
    this.currentCustomizedPizzaAddons = addonIds;
  }
  addCustomisedPizzaAddonLabel(isChecked: any, addonInfo: any) {
    //let isChecked = event.target.checked;
    let addon_id = addonInfo?._id;
    let addonIds: any = this.currentCustomizedPizzaAddons;
    if (!isChecked) {
      addonIds.push(addon_id);
      //addonPrices.push(addon_price);
    } else {
      let index = addonIds.findIndex((x: any) => x === addon_id);
      //addonIds = addonIds.filter((x:any) => x !== addon_id);
      addonIds.splice(index, 1);
      //addonPrices.splice(index, 1);
    }
    //let addonSum = addonPrices.reduce((a: number, b: number) => +a + +b, 0);
    // let finalSum = +addonSum + +this.currentCustomisedPizzaPrice;
     this.currentCustomizedPizzaAddons = addonIds;
    // this.currentCustomisedPizzaAddonsPrice = addonPrices;
    // this.currentCustomisedPizzaFinalPrice = finalSum;
  }

  selectCustomisedPizzaAddon(event: any, addonInfo: any,category_name:any):void{
   // console.log(event);
    let addon_id = addonInfo?._id;
    let addon_price = addonInfo?.addon_price;
    this.currentCustomizedPizzaSelectedId = addon_id;
    this.currentCustomizedPizzaSelectedPrice=addon_price;
    let selectedRadioCustomizedPizzaSelectedIds=this.radioCustomizedPizzaSelectedIds;
    selectedRadioCustomizedPizzaSelectedIds.forEach(function (item:any, index:any) {
      if(item?.cat_name==category_name){
        selectedRadioCustomizedPizzaSelectedIds[index]['product_addon_id'] = addon_id;
      }
      else{
        selectedRadioCustomizedPizzaSelectedIds.push({'cat_name':category_name,'product_addon_id':addon_id});
      }
    });

    this.radioCustomizedPizzaSelectedIds = selectedRadioCustomizedPizzaSelectedIds;
    let radioInAddon:any=[];
    this.radioCustomizedPizzaSelectedIds.forEach(function (item:any, key:any) {
      radioInAddon.push(item?.product_addon_id);
    })
    this.radioforCustomizedPizzaSelectedId = radioInAddon;
    this.customizedPizzaForm?.patchValue({
      ingredientId: this.currentCustomizedPizzaSelectedId,
      ingredientPrice: this.currentCustomizedPizzaSelectedPrice,
      });
  }
  selectCustomisedPizzaAddonLabel(event: any, addonInfo: any,category_name:any):void{
    //console.log(event);
    let addon_id = addonInfo?._id;
    let addon_price = addonInfo?.addon_price;
    this.currentCustomizedPizzaSelectedId = addon_id;
    this.currentCustomizedPizzaSelectedPrice=addon_price;
    let selectedRadioCustomizedPizzaSelectedIds=this.radioCustomizedPizzaSelectedIds;
    selectedRadioCustomizedPizzaSelectedIds.forEach(function (item:any, index:any) {
      if(item?.cat_name==category_name){
        selectedRadioCustomizedPizzaSelectedIds[index]['product_addon_id'] = addon_id;
      }
      else{
        selectedRadioCustomizedPizzaSelectedIds.push({'cat_name':category_name,'product_addon_id':addon_id});
      }
    });

    this.radioCustomizedPizzaSelectedIds = selectedRadioCustomizedPizzaSelectedIds;
    let radioInAddon:any=[];
    this.radioCustomizedPizzaSelectedIds.forEach(function (item:any, key:any) {
      radioInAddon.push(item?.product_addon_id);
    })
    this.radioforCustomizedPizzaSelectedId = radioInAddon;
    
    
    // let addon_id = addonInfo?._id;
    // let addon_price = addonInfo?.addon_price;
    // this.currentCustomizedPizzaSelectedId = addon_id;
    // this.currentCustomizedPizzaSelectedPrice=addon_price;
  }
  addToCartCustomPizza(event: any) {
    this.isSubmitted = true;
		if (this.customizedPizzaForm.status == "VALID") {
      let product_name = this.customizedPizzaForm.get('product_name').value;
      let addons = this.currentCustomizedPizzaAddons;
      let radioAddons = this.radioCustomizedPizzaSelectedIds;
      let notInAddon:any=[];
      this.radioCustomizedPizzaSelectedIds.forEach(function (item:any, key:any) {
        let index = addons.findIndex((x: any) => x === item?.product_addon_id);
        if(index!=-1){
          //notInAddon.push(item?.product_addon_id);
        }
        else{
          notInAddon.push(item?.product_addon_id);
        }

      })
     
      addons =  addons.concat(notInAddon);
      
      let payload = {
        user_id: this.userId,
        product_type: "custom",
        product_name:product_name,
        product_ingredients: JSON.stringify(addons),
      };
      this.spinner.show();
      this.commonservice.postData(payload, "add-to-cart").subscribe(
        (res) => {
            this.spinner.hide();
            if (res.status == "success") {
              this.signaturePizzaForm.reset(); 
              this.toastr.success('Item added to your cart successfully');
              this.currentCustomizedPizzaSelectedId = this.defaultCustomizedPizzaSelectedId;
              this.currentCustomizedPizzaAddons =[];
              this.radioCustomizedPizzaSelectedIds=[];


            this.radioCustomizedPizzaSelectedIds.push({'cat_name':this.defaultCategory,'product_addon_id':this.defaultCustomizedPizzaSelectedId});
             // this.defaultCategory = this.customizedPizzas[key]?.category_name;
              

            this.commonservice?.setAllCartItems();

            this.radioforCustomizedPizzaSelectedId=[];
            this.radioforCustomizedPizzaSelectedId=[this.defaultCustomizedPizzaSelectedId];
              //this.defaultCustomizedPizzaSelectedId=this.customizedPizzas[key]?.products[0]?._id;
                

            this.isSubmitted = false;
            this.customizedPizzaForm?.patchValue({
              product_name: '',
            });
          } else {
            //this.toastr.error('Something went wrong, Please try again later');
            //this.paginationOptions = Global.resetPaginationOption();
          }
        },
        (err) => {
         // this.paginationOptions = Global.resetPaginationOption();
          this.spinner.hide();
          this.customizedPizzaForm?.patchValue({
            product_name: product_name,
          });
        }
      );
    }
  }

  addWishlistSignaturePizza(id: any) {
    let payload = {
      user_id: this.userId,
      product_type: "signature",
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
    setTimeout(() => {});
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
    //let isChecked = event.target.checked;
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
  openWishlistFormModal(passedModaldata: any) {
    if(this.isShowLoginForm){
      this.wishlistSignaturePizzaPrice = passedModaldata?.selling_price;
      this.wishlistSignaturePizzaFinalPrice = this.wishlistSignaturePizzaPrice;
      this.wishlistModalData = passedModaldata;
      this.wishlistSignaturePizzaAddons = [];
      this.wishlistSignaturePizzaAddonsPrice = [];
      this.spinner.show();
      setTimeout(() => {
        this.wishlistFormModal.show();
        this.spinner.hide();
      },1000);
    }
    else{
      this.isShowLoginSectionForm=true;
      this.isShowSignupSectionForm=false;
      window.localStorage?.setItem('lastVisitedUrl', this.router?.url);
      this.loginSignupModal.show();
    }   
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

  
  
}
