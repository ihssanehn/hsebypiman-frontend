
import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '@app/core/auth';
import { CatQuestion } from '@app/core/models';
import { CatQuestionService } from '@app/core/services';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'tf-vs-form-signatures',
  templateUrl: './vs-form-signatures.component.html',
  styleUrls: ['./vs-form-signatures.component.scss']
})
export class VsFormSignaturesComponent implements OnInit, AfterViewInit {

  catQuestionsList: CatQuestion[];
  needHseValidation: false;


  @Input() visiteForm: FormGroup;
  @Input() isDisableToggle: boolean;
  @Input() origin: string;
  @Input() canValidateHse: boolean;
  @Output() hseSigned = new EventEmitter();
  
  public isExpanded : boolean = true;
  public startSignHse : boolean = false;

  @ViewChild('sign_canvas_redacteur', null) signaturePad1: SignaturePad;
  @ViewChild('sign_canvas_visite', null) signaturePad2: SignaturePad;
  @ViewChild('sign_canvas_resp_hse', null) signaturePad3: SignaturePad;

  @ViewChild('signatureContainer1', null) signatureContainer1: ElementRef;
  @ViewChild('signatureContainer2', null) signatureContainer2: ElementRef;
  @ViewChild('signatureContainer3', null) signatureContainer3: ElementRef;

  private canvas: Object = {
    'minWidth': 0.5,
    'canvasWidth': 400,
    'canvasHeight': 150
  }
  public signaturePadOptions: Object = { 
    'minWidth': this.canvas['minWidth'],
    'canvasWidth': this.canvas['canvasWidth'],
    'canvasHeight': this.canvas['canvasHeight'],
  };

  constructor(
    private catQuestionService:CatQuestionService,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public _sanitizer: DomSanitizer

  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
    if(this.origin == 'add'){
      var width = this.signatureContainer2.nativeElement.offsetWidth - 1;
      if(this.signaturePad1){this.signaturePad1.set('canvasWidth', width)};
      if(this.signaturePad2){this.signaturePad2.set('canvasWidth', width)};
      if(this.signaturePad3){this.signaturePad3.set('canvasWidth', width)};
    }
  }

  // PAD1
  clearSignature(i) {
    this.signaturePad1.clear();
    this.visiteForm.controls[i].get('signature').reset();
    this.visiteForm.controls[i].get('date').reset();
  }

  resizeSignaturePad() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signaturePad1.set('canvasWidth', this.canvas['canvasWidth'] / ratio);
  }
 
  drawComplete(i) {
    this.visiteForm
      .controls[i].get('signature')
      .setValue(this.signaturePad1.toDataURL());

    this.visiteForm.controls[i].get('date').setValue(moment().format('YYYY-MM-DD'));
  }

  // Pad2
  clearSignature2(i) {
    this.signaturePad2.clear();
    this.visiteForm.controls[i].get('signature').reset();
    this.visiteForm.controls[i].get('date').reset();
  }

  resizeSignaturePad2() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signaturePad2.set('canvasWidth', this.canvas['canvasWidth'] / ratio);
  }
 
  drawComplete2(i) {
    this.visiteForm
      .controls[i].get('signature')
      .setValue(this.signaturePad2.toDataURL());

    this.visiteForm.controls[i].get('date').setValue(moment().format('YYYY-MM-DD'));
  }

  // Pad3
  clearSignature3(i) {
    this.signaturePad3.clear();
    this.visiteForm.controls[i].get('signature').reset();
    this.visiteForm.controls[i].get('date').reset();
  }

  resizeSignaturePad3() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signaturePad3.set('canvasWidth', this.canvas['canvasWidth'] / ratio);
  }
 
  drawComplete3(i) {
    this.visiteForm
      .controls[i].get('signature')
      .setValue(this.signaturePad3.toDataURL());

    this.visiteForm.controls[i].get('date').setValue(moment().format('YYYY-MM-DD'));

  }

  validateSignatureHse(i){
    this.visiteForm.controls[i].get('signature').disable();
    this.canValidateHse = false;
    this.startSignHse = false;
    this.hseSigned.emit(true);
  }

  showSignature(i){
    return this.visiteForm
    .controls[i].get('signature')
    .value ? this.visiteForm
    .controls[i].get('signature')
    .value : false
  }

  isDisabledHseSignature(){
    return this.visiteForm
    .controls['signature_resp_hse'].get('signature')
    .disabled ? this.visiteForm
    .controls['signature_resp_hse'].get('signature')
    .disabled : false
  }

  canShowHse(){;
    return this.startSignHse || this.showSignature('signature_resp_hse');
  }
  
	validateHse(){
		if(this.startSignHse){
			this.visiteForm.controls['signature_resp_hse'].get('signature').disable();
			this.startSignHse = false;
		}else{
			this.visiteForm.controls['signature_resp_hse'].get('signature').enable();
			this.startSignHse = true;
		}
		this.cdr.markForCheck();
	}
}
