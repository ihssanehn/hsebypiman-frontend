import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User, AuthService } from '@app/core/auth';
import { Entreprise } from '@app/core/models';
import { EntrepriseService } from '@app/core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'tf-signature-add',
  templateUrl: './signature-add.component.html',
  styleUrls: ['./signature-add.component.scss']
})
export class SignatureAddComponent implements OnInit {

  @Input() isSigned: boolean;

  @Input() signaturesForm: FormArray;

  currentUser : User;
  signable_id : number;
  entreprisesList: Entreprise[];
  entreprisesLoaded: boolean = false;
  errors;

  @ViewChild(SignaturePad,null) signaturePad: SignaturePad;
  private canvas: Object = {
    'minWidth': 0.5,
    'canvasWidth': 500,
    'canvasHeight': 150
  }
  public signaturePadOptions: Object = { 
    'minWidth': this.canvas['minWidth'],
    'canvasWidth': this.canvas['canvasWidth'],
    'canvasHeight': this.canvas['canvasHeight'],
  };


  constructor(
    private authService: AuthService,
    private entrepriseService: EntrepriseService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    this.getEntreprises();
    this.getCurrentUser();

    this.activatedRoute.params
    .subscribe(
      async params => {
        if(params.id){
          this.signable_id = params.id;
          if(!this.isSigned){
            (this.signaturesForm as FormArray)
              .controls[0]
              .get('signable_id')
              .setValue(params.id);
          }
        }
      }
    );
  
  }

  ngAfterViewInit() {
    if(!this.isSigned){
      this.signaturePad.set('minWidth', 0.5);
      this.signaturePad.clear();
    }
  }


  async getCurrentUser(){
    var res = await this.authService.getUserByToken().toPromise();
    this.currentUser = res.result.data;
    if(!this.isSigned){
      (this.signaturesForm as FormArray).controls[0].get('personnel_id').setValue(res.result.data.id);
      (this.signaturesForm as FormArray ).controls[0].get('personnel').setValue(res.result.data);
    }
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getEntreprises(){
    this.entreprisesLoaded = false;
    var res = await this.entrepriseService.getList().toPromise();
    if(res){
      this.entreprisesList = res.result.data;
      this.entreprisesLoaded = true;
    }
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  addSignatures() {
    this.signaturesForm.insert(0, this.newSignature());
  }

  newSignature(): FormGroup {
    return this.fb.group({
      signable_id:[this.signable_id],
      date:[this.setDateFormat(new Date())],
      personnel:[null],
      personnel_id:[null],
      signataire_fullname:[null],
      entreprise_id:[null, Validators.required],
      signature:[null],
      commentaires:[null],
      remarks:[null],
    });
  }

  removeSignature(i:number) {
    this.signaturesForm.removeAt(i);
  }

  clearSignature(i:number) {
    this.signaturePad.clear();
    this.signaturesForm.controls[i].get('signature').reset();
  }

  resizeSignaturePad() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signaturePad.set('canvasWidth', this.canvas['canvasWidth'] / ratio);
  }
 
  drawComplete(i:number) {
    this.signaturesForm
      .controls[i].get('signature')
      .setValue(this.signaturePad.toDataURL());
  }

  setDateFormat(date){
    return date ? moment(date).format('YYYY-MM-DD') : null;
  }

}
