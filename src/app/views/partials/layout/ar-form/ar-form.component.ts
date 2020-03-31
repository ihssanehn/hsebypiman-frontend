import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'tf-ar-form',
  templateUrl: './ar-form.component.html',
  styleUrls: ['./ar-form.component.scss']
})
export class ArFormComponent implements OnInit {

  @Input() arForm: FormBuilder;
  constructor() { }

  ngOnInit() {
  }

}
