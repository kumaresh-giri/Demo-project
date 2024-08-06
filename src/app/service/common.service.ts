import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import{ apiURL } from './global-constants';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from "uuid";
export const TABLE_LENGTH = 10;
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  token: any;
  constructor(private http: HttpClient,private toastr: ToastrService) { }
  public loggeduser = new BehaviorSubject<any>("");
  public pageHeading = new BehaviorSubject<any>("");
  public uploadPath = new BehaviorSubject<any>("");
  //public allCartItems = new BehaviorSubject<any>([]);
  private allCartItems: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private totalCartCount:BehaviorSubject<any> = new BehaviorSubject<any>(0);
  private cartSubTotal:BehaviorSubject<any> = new BehaviorSubject<any>(0);
  private cartResturaHandlingCharge:BehaviorSubject<any> = new BehaviorSubject<any>(0);
  private cartTotalTax:BehaviorSubject<any> = new BehaviorSubject<any>(0);
  private cartNetTotal:BehaviorSubject<any> = new BehaviorSubject<any>(0);
  private cartDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
  //public modalClose = new BehaviorSubject<any>(false);
  private isLoggedIn:BehaviorSubject<any> = new BehaviorSubject<any>(false);
  private whetherSignCustomizedPizaaTab:BehaviorSubject<any> = new BehaviorSubject<any>('custom');
  private isModalFieldSetToEmpty:BehaviorSubject<any> = new BehaviorSubject<any>(false);
  private payableAmount: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  private checkoutCartItems: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private addressLatLong: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private showLoginSignup: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  private isShowLoginForm: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  private resetLoginSignup: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  private userUuid : BehaviorSubject<any> = new BehaviorSubject<any>(0);
 
  // private showSignupForm:BehaviorSubject<any> = new BehaviorSubject<any>(true);
  //private showVerifyEmailForm:BehaviorSubject<any> = new BehaviorSubject<any>(false);

  setUser(): void {
    this.loggeduser.next(
      JSON.parse(window.localStorage.getItem('userDetails') || '{}')
    );
  }

  postFormDataWithToken(body: any, url: any): Observable<any> {
    this.token = window.localStorage.getItem('authtoken');
    if (this.token == null) {
      this.token = "";
    }
    const webservice_path = apiURL;
    let form_data = new FormData();

    for (var key in body) {
      form_data.append(key, body[key]);
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'x-access-token':this.token
        //'token':this.token
      })
    }
    return this.http.post(webservice_path + url, form_data, httpOptions)
  }

postData(body: any, url: any): Observable<any> {
 // console.log('url');
  //console.log(url);
    this.token = window.localStorage.getItem('authtoken');
    if (this.token == null) {
      this.token = "";
    }
    const webservice_path = apiURL;
    let form_data = new FormData();

    for (var key in body) {
      form_data.append(key, body[key]);
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'x-access-token':this.token
        //'token':this.token
      })
    }
    return this.http.post(webservice_path + url, form_data, httpOptions)
  }
  putData(body: any, url: any): Observable<any> {
    this.token = window.localStorage.getItem('authtoken');
    if (this.token == null) {
      this.token = "";
    }
    const webservice_path = apiURL;
    let form_data = new FormData();

    for (var key in body) {
      form_data.append(key, body[key]);
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'token':this.token
      })
    }
    return this.http.put(webservice_path + url, form_data, httpOptions)
  }




  getData(url: any): Observable<any> {
    this.token = window.localStorage.getItem('authtoken');
    if (this.token == null) {
      this.token = "";
    }
    const webservice_path = apiURL;

    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'token': this.token
      })
    }
    return this.http.get(webservice_path + url,httpOptions)
  }

resetPaginationOption() {
    return {
        hasNextPage: false,
        hasPrevPage: false,
        limit: TABLE_LENGTH,
        nextPage: null,
        page: 1,
        pagingCounter: 1,
        prevPage: null,
        totalDocs: 0,
        totalPages: 1,
    }
}



  postDataRaw(body: any, url: any): Observable<any> {
    this.token = window.localStorage.getItem('authtoken');
    if (this.token == null) {
      this.token = "";
    }
    const webservice_path = apiURL;

    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'token': this.token,
        'x-access-token':this.token
      })
    }
    return this.http.post(webservice_path + url, body, httpOptions)
  }

  putDataRaw(body: any, url: any): Observable<any> {
    this.token = window.localStorage.getItem('authtoken');
    if (this.token == null) {
      this.token = "";
    }
    const webservice_path = apiURL;

    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'token': this.token
      })
    }
    return this.http.put(webservice_path + url, body, httpOptions)
  }

  async getDataAsync(url: any): Promise<any> {
    this.token = window.localStorage.getItem('authtoken');
    if (this.token == null) {
      this.token = "";
    }
    const webservice_path = apiURL;

    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'token': this.token
      })
    }
    return await this.http.get(webservice_path + url,httpOptions).toPromise();
  }

  async postDataAsync(body: any, url: any): Promise<any> {
    this.token = window.localStorage.getItem('authtoken');
    if (this.token == null) {
      this.token = "";
    }
    const webservice_path = apiURL;
    let form_data = new FormData();

    for (var key in body) {
      form_data.append(key, body[key]);
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'token': this.token
      })
    }
    return await  this.http.post(webservice_path + url, form_data, httpOptions).toPromise()
  }
  async postDataRawAsync(body: any, url: any): Promise<any> {
    this.token = window.localStorage.getItem('authtoken');
    if (this.token == null) {
      this.token = "";
    }
    const webservice_path = apiURL;

    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'token': this.token
      })
    }
    return await  this.http.post(webservice_path + url, body, httpOptions).toPromise()
  }

  showSuccess(message:any, title:any){
    this.toastr.success(message, title,{timeOut: 1000})
}

showError(message:any, title:any){
    this.toastr.error(message, title,{timeOut: 1000})
}

showInfo(message:any, title:any){
    this.toastr.info(message, title,{timeOut: 1000})
}

showWarning(message:any, title:any){
    this.toastr.warning(message, title,{timeOut: 1000})
}
getAuthStatus(){
  this.token = window.localStorage.getItem('authtoken');
  if (this.token == null || this.token=='') {
    return false;
  }
  else{
    return true;
  }
}

getDatatest(url: any): Observable<any> {
  this.token = window.localStorage.getItem('authtoken');
  if (this.token == null) {
    this.token = "";
  }
  const webservice_path = apiURL;

  let httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'token': this.token
    })
  }
  return this.http.get('http://restapi.adequateshop.com' + url,httpOptions)
}


async setAllCartCalculation(amount:any,resturaHandlingCharge:any,tax:any){
  let restura_handling_charge = resturaHandlingCharge;
  await this.cartResturaHandlingCharge?.next(restura_handling_charge);
  let restura_tax_charge = tax;
  let total_tax = amount*restura_tax_charge/100;
  
  //total_tax = Math.round(total_tax);
  //total_tax.toFixed(2);
  await this.cartTotalTax?.next(total_tax);
  //console.log('total_tax');
  //console.log(total_tax);
  let finalSum = +amount + +restura_handling_charge + +total_tax;
  //finalSum = Math.round(finalSum)
  finalSum.toFixed(2);
  //console.log('finalSum');
  //console.log(finalSum);
  await this.cartNetTotal?.next(finalSum);
  await this.payableAmount?.next(finalSum);
}


// async setAllCartCalculation(amount:any){
//  await this.postData('',"get-settings-data")
//   .subscribe(
//     (res) => {
//       if (res.status == "success") {
//         console.log(res);
//         let restura_handling_charge = res?.settingData?.resturant_handling_charge;
//         this.cartResturaHandlingCharge?.next(restura_handling_charge);
//         let restura_tax_charge = res?.settingData?.vat_amount;
//         let total_tax = amount*restura_tax_charge/100;
//         this.cartTotalTax?.next(total_tax);
//         let finalSum = +amount + +restura_handling_charge + +total_tax;
//         this.cartNetTotal?.next(finalSum);
//         this.payableAmount?.next(finalSum);
//        // this.setPayableAmount(amount);
//           //cartNetTotal=finalSum;

//         //this.footerSettingContent = res?.settingData;
//       } else {
//         // this.toastr.error(res?.message);
//       }
//     },
//     (err) => {
//       this.toastr.error('Something went wrong, Please try again later');
      
//     }
//   );
 //}
  


     
      








setAllCartItems(): void {
  let userId = window.localStorage.getItem('userId');
  let cartarray:any = [];
  this.postData({ user_id:userId}, 'view-cart')
   // ?.pipe(map((res) => res?.cart_item?.docs))
    ?.subscribe((response: any) => {
     // console.log(response);
      this.totalCartCount?.next(response?.cart_item?.length);
      let priceArr :any= [];
      let finalPriceArr :any= [];
      let cartTotalTax =0;
      let cartResturaHandlingCharge=0;
      let cartNetTotal = 0;
      let cartItems = response?.cart_item;
      Object.entries(cartItems).forEach((cartIt:any,key:any)=>{
        let singlePriceArr = [];
        cartarray.push(cartIt[1]?._id); 
        
        let overallSinglePizzaPrice = 0;
        let overallSinglePizzaPriceQty = 0;
         //console.log('key'+key);
        // console.log(cartIt[1]?.qty);
        if (cartIt[1]?.product[0]?.selling_price == undefined || cartIt[1]?.product[0]?.selling_price === null) {
          priceArr.push(0); 
          singlePriceArr.push(0);
        }
        else{
          priceArr.push(cartIt[1]?.product[0]?.selling_price); 
          singlePriceArr.push(cartIt[1]?.product[0]?.selling_price);
        }
        let AddonArr = cartIt[1]?.product_addons;
        for(let AddonArrprice of AddonArr){
          if (AddonArrprice?.addon_price == undefined || AddonArrprice?.addon_price === null) {
           priceArr.push(0); 
            singlePriceArr.push(0); 
          }
          else{
            singlePriceArr.push(AddonArrprice?.addon_price); 
            priceArr.push(AddonArrprice?.addon_price); 
          }
        }
        let AddonIngrArr = cartIt[1]?.product_ingredients;
        for(let AddonIngrprice of AddonIngrArr){
          if (AddonIngrprice?.selling_price == undefined || AddonIngrprice?.selling_price === null) {
            priceArr.push(0); 
            singlePriceArr.push(0); 

          }
          else{
            priceArr.push(AddonIngrprice?.selling_price); 
            singlePriceArr.push(AddonIngrprice?.selling_price); 
          }
        }
        overallSinglePizzaPrice = singlePriceArr.reduce((a: number, b: number) => +a + +b, 0);
        overallSinglePizzaPriceQty = overallSinglePizzaPrice*cartIt[1]?.qty;
        cartItems[key] = { ...cartIt[1], overallSinglePizzaPrice: overallSinglePizzaPrice} 
       // console.log(cartItems);
        finalPriceArr.push(overallSinglePizzaPriceQty);
      })

     this.allCartItems?.next(cartItems);  
//console.log(cartItems);
//console.log(priceArr);
     
// for(let cartIt of cartItems){
        
//         let singlePriceArr = [];
//         let singlePrice = 0;
//         //priceArr.push(cartIt?.product[0]?.selling_price); 
//         if (cartIt?.product[0]?.selling_price == undefined || cartIt?.product[0]?.selling_price === null) {
//           priceArr.push(0); 
//           singlePriceArr.push(0);
//         }
//         else{
//           priceArr.push(cartIt?.product[0]?.selling_price); 
//           singlePriceArr.push(cartIt?.product[0]?.selling_price);
//         }

//         let AddonArr = cartIt?.product_addons;
//         for(let AddonArrprice of AddonArr){
//           if (AddonArrprice?.addon_price == undefined || AddonArrprice?.addon_price === null) {
//            priceArr.push(0); 
//             singlePriceArr.push(0); 
//           }
//           else{
//             singlePriceArr.push(AddonArrprice?.addon_price); 
//             priceArr.push(AddonArrprice?.addon_price); 
//           }
//         }

//         let AddonIngrArr = cartIt?.product_ingredients;
//         for(let AddonIngrprice of AddonIngrArr){
//           if (AddonIngrprice?.selling_price == undefined || AddonIngrprice?.selling_price === null) {
//             priceArr.push(0); 
//             singlePriceArr.push(0); 

//           }
//           else{
//             priceArr.push(AddonIngrprice?.selling_price); 
//             singlePriceArr.push(AddonIngrprice?.selling_price); 
//           }
//         }

//         //priceArr =singlePriceArr; 


//         singlePrice = singlePriceArr.reduce((a: number, b: number) => +a + +b, 0);
//         // cartItems[key] = { ...cartIt, singlePrice: singlePrice}
//        // console.log('singlePrice'+singlePrice);
// //console.log(cartIt);
//       }

      //console.log(cartItems);

      // for(let cartIt of cartItems){
      //   let singlePriceArr = [];
      //   let singlePrice = 0;
      //   singlePriceArr.push(cartIt?.product[0]?.selling_price); 
      //   let AddonArr = cartIt?.product_addons;
      //   for(let AddonArrprice of AddonArr){
      //     singlePriceArr.push(AddonArrprice?.addon_price); 
      //   }
      //   let IngredientArr = cartIt?.product_ingredients;
      //   for(let IngredientArrprice of IngredientArr){
      //     singlePriceArr.push(IngredientArr?.selling_price); 
      //   }
      //   priceArr =singlePriceArr; 
      //   singlePrice = singlePriceArr.reduce((a: number, b: number) => +a + +b, 0);
      //   console.log('singlePrice'+singlePrice);
      //   // priceArr.push(cartIt?.product[0]?.selling_price); 
      //   // let AddonArr = cartIt?.product_addons;
      //   // for(let AddonArrprice of AddonArr){
      //   //   priceArr.push(AddonArrprice?.addon_price); 
      //   // }
      //   // let IngredientArr = cartIt?.product_ingredients;
      //   // for(let IngredientArrprice of IngredientArr){
      //   //   priceArr.push(IngredientArr?.selling_price); 
      //   // }


      // }

      //console.log(priceArr);
      let NormalAndaddonSum = finalPriceArr.reduce((a: number, b: number) => +a + +b, 0);
      let cartSubTotal = NormalAndaddonSum;
      this.cartSubTotal?.next(cartSubTotal);
      //this.cartSubTotal?.next(cartSubTotal);

      // let finalSum = +cartSubTotal + +cartResturaHandlingCharge + +cartTotalTax;
      // //finalSum = parseFloat(finalSum);
      // finalSum.toFixed(2);
      // cartNetTotal=finalSum;
      this.setCheckoutCartItems(cartarray);
      
      // this.cartDetails?.next({
      //   cartSubTotal:cartSubTotal,
      //   cartResturaHandlingCharge:cartResturaHandlingCharge,
      //   cartTotalTax:cartTotalTax,
      //   cartNetTotal:cartNetTotal

      // });
      
      
      


      //this.cartDetails?.next(response?.cart_item?.totalDocs);

      //console.log('common sevice observable');
      //console.log(response);
    });
}

// setModalClose(data:any):any{
//   this.modalClose.next(data);
// }
// getModalClose():any{
//   return this.modalClose.asObservable();
// }

getAllCartItems(): Observable<any> {
  return this.allCartItems?.asObservable();
}
getTotalCartCount(): Observable<any> {
  return this.totalCartCount?.asObservable();
}

getCartDetails():Observable<any> {
  return this.cartDetails?.asObservable();
}
getCartSubTotal():Observable<any> {
  return this.cartSubTotal?.asObservable();
}
getCartResturaHandlingCharge():Observable<any> {
  return this.cartResturaHandlingCharge?.asObservable();
}
getCartTotalTax():Observable<any> {
  return this.cartTotalTax?.asObservable();
}
getCartNetTotal():Observable<any> {
  return this.cartNetTotal?.asObservable();
}


setSignCustomizedPizaaTab(data:any):any{
  this.whetherSignCustomizedPizaaTab.next(data);
}

getSignCustomizedPizaaTab():Observable<any> {
  return this.whetherSignCustomizedPizaaTab?.asObservable();
}

// setShowSignupFrom(data:any):any{
//   this.showSignupForm.next(data);
// }
// setShowverifyEmailFrom(data:any):any{
//   this.showVerifyEmailForm.next(data);
// }

// getShowSignupFrom():Observable<any> {
//   return this.showSignupForm?.asObservable();
// }
// getShowVerifyEmailForm():Observable<any> {
//   return this.showVerifyEmailForm?.asObservable();
// }

setIsLoggedIn(data:any):any{
  let token = window.localStorage.getItem('authtoken');
  if(token!==null){
    this.isLoggedIn.next(true);
  }
  else if(data==true){
    this.isLoggedIn.next(data);
  }
  else{
    this.isLoggedIn.next(false);
  }
}
getIsLoggedIn():any{
  return this.isLoggedIn.asObservable();
}

setModalFieldSetToEmpty(data:any):any{
  this.isModalFieldSetToEmpty.next(data);
}

getModalFieldSetToEmpty():Observable<any> {
  return this.isModalFieldSetToEmpty?.asObservable();
}
setShowLoginSignup(data:any):any{
  this.isModalFieldSetToEmpty.next(data);
}

getShowLoginSignup():Observable<any> {
  return this.isModalFieldSetToEmpty?.asObservable();
}

setResetLoginSignup(data:any):any{
  this.resetLoginSignup.next(data);
}

getResetLoginSignup():Observable<any> {
  return this.resetLoginSignup?.asObservable();
}

setPayableAmount(data: any): void {
  this.payableAmount.next(data);
}
getPayableAmount(): any {
  let amount = this.payableAmount.value;
  return this.payableAmount.value;
}
setCheckoutCartItems(data: any): void {
  this.checkoutCartItems.next(data);
}
getCheckoutCartItems(): any {
  return this.checkoutCartItems.value;
}

setIsShowLoginForm(data: any): void {
  this.isShowLoginForm.next(data);
}
getIsShowLoginForm():Observable<any> {
  return this.isShowLoginForm?.asObservable();
}


// private showLoginSignup: BehaviorSubject<any> = new BehaviorSubject<any>(0);
//   private isShowLoginForm: BehaviorSubject<any> = new BehaviorSubject<any>(0);



setHeaderAddressLatLong(data:any):any{
  if(data){
    this.addressLatLong.next(data);
  }
  else{
    let latlongaddress = {
      address:window.localStorage.getItem('homeAddress') || '',
      addresslat:window.localStorage.getItem('homeLat') || '',
      addressLong:window.localStorage.getItem('homeLong') || ''
    };
    this.addressLatLong.next(latlongaddress);
  }
  
  // this.loggeduser.next(
  //     JSON.parse(window.localStorage.getItem('userDetails') || '{}')
  //   );
}

getHeaderAddressLatLong():Observable<any> {
  return this.addressLatLong?.asObservable();
}

getActiveMenuSlug(){
  let activemenu = window.localStorage.getItem('activeMenuSlug');
  if (activemenu == null || activemenu=='') {
    return 'custom';
  }
  else{
    return activemenu;
  }
}

//private userUuid : BehaviorSubject<any> = new BehaviorSubject<any>(0);
 
// private showSignupForm:BehaviorSubject<any> = new BehaviorSubject<any>(true);
//private showVerifyEmailForm:BehaviorSubject<any> = new BehaviorSubject<any>(false);

setuserUuid(): void {
  // let userUUId = '';
  // if(window.localStorage.getItem("userId")){
  //   this.userId = window.localStorage.getItem("userId");
  // }
  // else{
  //   const currentTimeInMilliseconds: string = uuidv4()+Date.now();
  //   window.localStorage.setItem("userId", currentTimeInMilliseconds);
  //   this.userId = window.localStorage.getItem("userId");
  // }

  // this.loggeduser.next(
  //   JSON.parse(window.localStorage.getItem('userDetails') || '{}')
  // );
}

getUserUuid(){
  if(window.localStorage.getItem("userId")){
    return window.localStorage.getItem("userId");
  }
  else{
    const currentTimeInMilliseconds: string = uuidv4()+Date.now();
    window.localStorage.setItem("userId", currentTimeInMilliseconds);
    return window.localStorage.getItem("userId");
  }

  

}

getValidSocialMediaUrl(url:any){
  var regexp = /(http(s)?:\/\/.)/
  let isvalid =  regexp.test(url);
  const withHttp =  !isvalid ? `https://${url}` : url;
  return withHttp;
}

















}
