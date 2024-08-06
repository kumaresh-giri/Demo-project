import { Component, OnInit } from '@angular/core';
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {
  orderLists: any = [];
  pageno:any=1;
  isShowLoadMore:any = 1;
  isShowLoader:any=0;
  recordCount:any=0;
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.fetchOrderLists();
  }
  fetchOrderLists() {
    this.spinner.show();
    this.isShowLoader = 1;
    this.commonService
    .postData(
      {pageno:this.pageno },
      "get-order"
    )
    .subscribe(
      (res) => {
        //console.log(res);
        this.recordCount = res?.orders?.totalDocs;

        this.spinner.hide();
        this.isShowLoader = 0;
        if (res.status == "success") {
          if(res?.orders?.hasNextPage){
            this.isShowLoadMore = 1;
          }
          else{
            this.isShowLoadMore =0;
          }
          this.orderLists = [...this.orderLists,...res?.orders?.docs];
           //this.spreadOrderLists = [];
          // if(this.pageno==1){
          //  //this.orderLists = res?.orders?.docs;
          //  this.orderLists = [...this.orderLists,...res?.orders?.docs];
          //   //this.orderLists = [...this.orderLists,res?.orders?.docs]
          // }
          // else{
          //   this.orderLists = [...this.orderLists,...res?.orders?.docs];
          //   //this.orderLists = arr
          //   //this.orderLists = spreadOrderLists;

          // }
          //console.log(this.orderLists);
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
