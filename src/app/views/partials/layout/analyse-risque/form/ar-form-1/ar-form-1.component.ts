import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'tf-ar-form-1',
  templateUrl: './ar-form-1.component.html',
  styleUrls: ['./ar-form-1.component.scss']
})
export class ArForm1Component implements OnInit {

  @Input() arForm: FormBuilder;
  @Input() edit: Boolean;
  constructor() { }

  ngOnInit() {
  }

}
