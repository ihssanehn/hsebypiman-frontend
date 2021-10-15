import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { FormStatus } from '@app/core/_base/crud/models/form-status';


@Component({
  selector: 'tf-multiple-mail',
  templateUrl: './multiple-mail.component.html',
  styleUrls: ['./multiple-mail.component.scss']
})
export class MultipleMailComponent implements OnInit {
  mailForm: FormArray;
  formStatus = new FormStatus();
  formloading: boolean= false;
  @Output() mailSent : EventEmitter<any[]> = new EventEmitter();
  constructor( private formBuilder : FormBuilder) { }

  ngOnInit() {
	this.mailForm = this.formBuilder.array([]);
	this.addRow();

  }
  addRow(){
	var newRow = this.formBuilder.group({
		email:[null,[Validators.required,Validators.email]],
	  });
	  this.mailForm.insert(0, newRow);
  }

  onSubmit(){
	this.formloading = true;
    let form = {...this.mailForm.getRawValue()};
    this.formStatus.onFormSubmitting();

	this.mailSent.emit(form);
  }

}
