import { Component, OnInit } from '@angular/core';
import { Type } from '@app/core/models';

@Component({
  selector: 'tf-admin-salaries',
  templateUrl: './admin-salaries.component.html',
  styleUrls: ['./admin-salaries.component.scss']
})
export class AdminSalariesComponent implements OnInit {

  types: Type[];

  constructor(
  ) { }

  ngOnInit() {
  }

}

