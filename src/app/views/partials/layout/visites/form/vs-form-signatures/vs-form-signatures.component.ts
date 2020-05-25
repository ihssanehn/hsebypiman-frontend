
import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl, Validators, FormArray } from '@angular/forms';
import { AuthService, User } from '@app/core/auth';
import { CatQuestion } from '@app/core/models';
import { CatQuestionService } from '@app/core/services';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import moment from 'moment';

@Component({
  selector: 'tf-vs-form-signatures',
  templateUrl: './vs-form-signatures.component.html',
  styleUrls: ['./vs-form-signatures.component.scss']
})
export class VsFormSignaturesComponent implements OnInit {

  catQuestionsList: CatQuestion[];

  @Input() visiteForm: FormGroup;
  @Input() isDisableToggle: boolean;
  @Input() origin: string;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  
  public isExpanded : boolean = true;

  @ViewChild('sign_canvas_redacteur', null) signaturePad1: SignaturePad;
  @ViewChild('sign_canvas_visite', null) signaturePad2: SignaturePad;
  @ViewChild('sign_canvas_resp_hse', null) signaturePad3: SignaturePad;

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
  ) { }

  ngOnInit() {
    // if(this.origin == 'add'){
    //   // this.signaturePad1.off();
    //   // this.signaturePad2.off();
    //   // this.signaturePad3.off();
    // }
    console.log(this.signaturePad1);
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

  

}
