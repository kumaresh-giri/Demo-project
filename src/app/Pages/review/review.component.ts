import { Component, OnInit } from '@angular/core';
import { CommonService } from "src/app/service/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  reviewLists: any = [];
  pageno:any=1;
  isShowLoadMore:any = 1;
  isShowLoader:any=0;
  public imageBaseUrl = environment?.imageBaseUrl;
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.fetchReviewLists();
  }

  fetchReviewLists() {
    this.spinner.show();
    this.isShowLoader = 1;
    this.commonService
    .postData(
      {pageno:this.pageno },
      "get-review"
    )
    .subscribe(
      (res) => {
        this.spinner.hide();
        this.isShowLoader = 0;
        if (res.status == "success") {
          if(res?.orders?.hasNextPage){
            this.isShowLoadMore = 1;
          }
          else{
            this.isShowLoadMore =0;
          }
          this.reviewLists = [...this.reviewLists,...res?.reviews?.docs];
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
