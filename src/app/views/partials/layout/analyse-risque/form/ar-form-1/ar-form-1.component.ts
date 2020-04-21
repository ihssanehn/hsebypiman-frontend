import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'tf-ar-form-1',
  templateUrl: './ar-form-1.component.html',
  styleUrls: ['./ar-form-1.component.scss']
})
export class ArForm1Component implements OnInit {

  @Input() arForm: FormGroup;
  @Input() edit: Boolean;

  toppings = new FormControl();
  toppingList: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  constructor() { }

  ngOnInit() {
    this.toppings = this.arForm.controls['accueil_secu_days'] as FormControl;
  }

}
