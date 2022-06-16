import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tf-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  success: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
