import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Type } from '@app/core/models';
import { TypeService } from '@app/core/services';

@Component({
  selector: 'tf-admin-salaries',
  templateUrl: './admin-salaries.component.html',
  styleUrls: ['./admin-salaries.component.scss']
})
export class AdminSalariesComponent implements OnInit {

  types: Type[];

  constructor(
    private typeService: TypeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

}

