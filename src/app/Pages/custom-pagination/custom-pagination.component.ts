import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import PaginationOptions from 'src/app/models/PaginationOptions';
import * as Global from 'src/app/service/global-constants';

@Component({
  selector: 'custom-pagination',
  templateUrl: './custom-pagination.component.html',
})
export class CustomPaginationComponent implements OnInit {
  @Input() rows: any[] = [];

  @Input() paginationOptions: PaginationOptions = {
    hasNextPage: false,
    hasPrevPage: false,
    limit: Global.TABLE_LENGTH,
    nextPage: null,
    page: 1,
    pagingCounter: 1,
    prevPage: null,
    totalDocs: 0,
    totalPages: 1,
  };

  @Output() onPageClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
}
