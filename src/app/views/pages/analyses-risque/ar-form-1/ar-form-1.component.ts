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
  
	horaire_list:[
		{display:'1h',value:1},
		{display:'2h',value:2},
		{display:'3h',value:3},
		{display:'4h',value:4},
		{display:'5h',value:5},
		{display:'6h',value:6},
		{display:'7h',value:7},
		{display:'8h',value:8},
		{display:'9h',value:9},
		{display:'10h',value:10},
		{display:'12h',value:12},
		{display:'13h',value:13},
		{display:'14h',value:14},
		{display:'15h',value:15},
		{display:'16h',value:16},
		{display:'17h',value:17},
		{display:'18h',value:18},
		{display:'19h',value:19},
		{display:'20h',value:20},
		{display:'21h',value:21},
		{display:'22h',value:22},
		{display:'23h',value:23},
		{display:'24h',value:24}
	]
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
