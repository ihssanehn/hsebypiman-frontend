import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'tf-chantier-form',
  templateUrl: './chantier-form.component.html',
  styleUrls: ['./chantier-form.component.scss']
})
export class ChantierFormComponent implements OnInit {

  @Input() chantierForm: FormBuilder;
  constructor() { }

  ngOnInit() {
  }

}
