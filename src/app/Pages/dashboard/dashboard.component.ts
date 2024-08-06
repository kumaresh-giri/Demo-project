import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  orderLists: any = [];
  pageno: any = 1;
  isShowLoadMore: any = 1;
  isShowLoader: any = 0;
  activeOrderCount: number = 0;
  deliveredOrderCount: number = 0;
  processingOrderCount: number = 0;
  recordCount:number=0;
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.fetchDasboardStaticstics();
    this.fetchOrderLists();
  }
  fetchDasboardStaticstics() {
    this.spinner.show();
    this.isShowLoader = 1;
    this.commonService
    .postData({ pageno: this.pageno }, "get-dashboard-data")
    .subscribe(
      (res) => {
        this.spinner.hide();
        this.isShowLoader = 0;
        if (res.status == "success") {
          let dashboradstats = res?.orders;
          dashboradstats.map((ddata: any) => {
            let datatype: any = ddata?._id;
            switch (datatype) {
              case "active":
                this.activeOrderCount = ddata?.count;
                break;
              case "delivered":
                this.deliveredOrderCount = ddata?.count;
                break;
              case "processing":
                this.processingOrderCount = ddata?.count;
                break;
              default:
                //
                break;
            }
          });
        } else {
          this.toastr.error(res?.message);
        }
      },
      (err) => {
        //this.toastr.error("Something went wrong, Please try again later");
        this.spinner.hide();
        this.isShowLoader = 0;
      }
    );
  }

  fetchOrderLists() {
    this.spinner.show();
    this.isShowLoader = 1;
    this.commonService.postData({ pageno: this.pageno }, "get-order").subscribe(
      (res) => {
        this.spinner.hide();
        this.isShowLoader = 0;
        this.recordCount = res?.orders?.totalDocs;
        if (res.status == "success") {
          if (res?.orders?.hasNextPage) {
            this.isShowLoadMore = 1;
          } else {
            this.isShowLoadMore = 0;
          }
          this.orderLists = [...this.orderLists, ...res?.orders?.docs];
        } else {
          this.toastr.error(res?.message);
        }
      },
      (err) => {
        //this.toastr.error("Something went wrong, Please try again later");
        this.spinner.hide();
        this.isShowLoader = 0;
      }
    );
  }
}
