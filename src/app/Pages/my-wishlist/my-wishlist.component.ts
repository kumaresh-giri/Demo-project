import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-my-wishlist",
  templateUrl: "./my-wishlist.component.html",
  styleUrls: ["./my-wishlist.component.scss"],
})
export class MyWishlistComponent implements OnInit {
  wishlistLists: any = [];
  pageno: any = 1;
  isShowLoadMore: any = 1;
  isShowLoader: any = 0;
  public imageBaseUrl = environment?.imageBaseUrl;
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.fetchWishlistLists();
  }

  fetchWishlistLists() {
    this.spinner.show();
    this.isShowLoader = 1;
    this.commonService
      .postData({ pageno: this.pageno }, "view-wishlist")
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.isShowLoader = 0;
          if (res.status == "success") {
            let priceArr: any = [];
            let cartItems = res?.wishlist_item;
            let cartarray = [];
            Object.entries(cartItems).forEach((cartIt: any, key: any) => {
              let singlePriceArr = [];
              cartarray.push(cartIt[1]?._id);
              let overallSinglePizzaPrice = 0;
              if (
                cartIt[1]?.product[0]?.selling_price == undefined ||
                cartIt[1]?.product[0]?.selling_price === null
              ) {
                priceArr.push(0);
                singlePriceArr.push(0);
              } else {
                priceArr.push(cartIt[1]?.product[0]?.selling_price);
                singlePriceArr.push(cartIt[1]?.product[0]?.selling_price);
              }
              let AddonArr = cartIt[1]?.product_addons;
              for (let AddonArrprice of AddonArr) {
                if ( AddonArrprice?.addon_price == undefined || AddonArrprice?.addon_price === null ) {
                  priceArr.push(0);
                  singlePriceArr.push(0);
                } else {
                  singlePriceArr.push(AddonArrprice?.addon_price);
                  priceArr.push(AddonArrprice?.addon_price);
                }
              }
              let AddonIngrArr = cartIt[1]?.product_ingredients;
              for (let AddonIngrprice of AddonIngrArr) {
                if ( AddonIngrprice?.selling_price == undefined || AddonIngrprice?.selling_price === null) {
                  priceArr.push(0);
                  singlePriceArr.push(0);
                } else {
                  priceArr.push(AddonIngrprice?.selling_price);
                  singlePriceArr.push(AddonIngrprice?.selling_price);
                }
              }
              overallSinglePizzaPrice = singlePriceArr.reduce((a: number, b: number) => +a + +b, 0);
              cartItems[key] = {
                ...cartIt[1],
                overallSinglePizzaPrice: overallSinglePizzaPrice,
              };
            });
            if (res?.wishlist_item?.hasNextPage) {
              this.isShowLoadMore = 1;
            } else {
              this.isShowLoadMore = 0;
            }
            if (this.pageno == 1) {
              this.wishlistLists = cartItems;
            } else {
              this.wishlistLists = [...this.wishlistLists, ...cartItems];
            }
          } else {
            this.toastr.error(res?.message);
          }
        },
        (err) => {
          this.toastr.error("Something went wrong, Please try again later");
          this.spinner.hide();
          this.isShowLoader = 0;
        }
      );
  }

  deleteWishlistItem(id: any) {
    this.spinner.show();
    this.commonService
      .postData({ wishlist_item_id: id }, "delete-wishlist")
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.status == "success") {
            this.commonService?.setAllCartItems();
            this.toastr.success("Item removed from wishlist");
            this.fetchWishlistLists();
          } else {
            this.toastr.error(res?.message);
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
}
