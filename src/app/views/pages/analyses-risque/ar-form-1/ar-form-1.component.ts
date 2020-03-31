import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { ArService } from '@app/core/services';
import { Ar } from '@app/core/models';
import { Router, ActivatedRoute } from '@angular/router';import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: 'tf-ar-form-1',
  templateUrl: './ar-form-1.component.html',
  styleUrls: ['./ar-form-1.component.scss']
})
export class ArForm1Component implements OnInit {
	
	model: String = 'ar';

	@Input() 
  		arForm: FormGroup;
	  
	// @Output() 
	// changeUnit = new EventEmitter<any>();
  
	// @Output() 
	//   setValue = new EventEmitter<any>();
  
	// @Output() 
	// recalculate = new EventEmitter<any>();
  
  	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
  	) {}

  	ngOnInit() {
  	}
	  
	// onSetValue(info){
	// 	this.setValue.emit( info );
	// }
	

}
