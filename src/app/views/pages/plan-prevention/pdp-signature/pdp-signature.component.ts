import { ChangeDetectorRef, Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from '@app/core/auth';
import { Pdp } from '@app/core/models';
import { PdpService } from '@app/core/services';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import moment from 'moment';
import Swal from 'sweetalert2';
import { PdpDetailComponent } from '../pdp-detail/pdp-detail.component';

@Component({
  selector: 'tf-pdp-signature',
  templateUrl: './pdp-signature.component.html',
  styleUrls: ['./pdp-signature.component.scss']
})
export class PdpSignatureComponent implements OnInit {
  
  @Input() pdp: Pdp;
  @Input() type: String;

  signaturesForm: FormArray;
  currentUser : User;
  formStatus = new FormStatus();
  formloading: boolean= false;

  @ViewChild('signaturePad',null) signaturePad: SignaturePad;
  @ViewChild('signaturePadEe',null) signaturePadEe: SignaturePad;
  @ViewChild('signaturePadEu',null) signaturePadEu: SignaturePad;
  @ViewChild('signaturePadSs',null) signaturePadSs: SignaturePad;

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
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected pdpService: PdpService,
    protected cdr: ChangeDetectorRef,
    protected _sanitizer: DomSanitizer,
    protected authService: AuthService,
    protected fb: FormBuilder,
    protected translate: TranslateService
  ) {
    this.authService.currentUser.subscribe(x=> this.currentUser = x);
  }

  ngOnInit() {
    this.signaturesForm = this.fb.array([]);
    switch(this.type) {
      case 'pdp_validations': 
          this.parseValidations(this.pdp.pdp_validations); 
          break;
      case 'pdp_intervenants':
          this.parseIntervenants(this.pdp.intervenants); 
          break;
    }
  }

  ngAfterViewInit() {
    if(this.signaturePad){
      this.signaturePad.set('minWidth', 0.5);
      this.signaturePad.clear();
    }
    if(this.signaturePadEe){
      this.signaturePadEe.set('minWidth', 0.5);
      this.signaturePadEe.clear();
    }
    if(this.signaturePadEu){
      this.signaturePadEu.set('minWidth', 0.5);
      this.signaturePadEu.clear();
    }
    if(this.signaturePadSs){
      this.signaturePadSs.set('minWidth', 0.5);
      this.signaturePadSs.clear();
    }
  }

  parseValidations(validations) {
    if(validations.length) {
      this.initValidationForm(validations);
    } else {
      this.createValidationForm();
    }
  }

  parseIntervenants(intervenants) {

  }

  initValidationForm(validations) {
    validations
      .filter(element => !element.signature)
      .forEach((element,index) => {
        var newForm = this.fb.group({
          signable_id:[this.pdp.id],
          personnel_id:[this.currentUser.id],
          date:[this.setDateFormat(new Date())],
          company_name:[element.company_name, Validators.required],
          full_name:[element.full_name, Validators.required],
          validation_at:[this.setDateFormat(new Date()), Validators.required],
          is_part_inspection:[element.is_part_inspection],
          part_inspection_at:[element.is_part_inspection? this.setDateFormat(element.part_inspection_at): null],
          signature:[null, Validators.required],
          validation_id:[element.id],
          type:[element.type]
        });
  
        this.signaturesForm.insert(index, newForm);
    });
  }

  createValidationForm() {
    var newForm = this.fb.group({
      signable_id:[this.pdp.id],
      personnel_id:[this.currentUser.id],
      date:[this.setDateFormat(new Date())],
      company_name:[null, Validators.required],
      full_name:[null, Validators.required],
      validation_at:[this.setDateFormat(new Date()), Validators.required],
      is_part_inspection:[0],
      part_inspection_at:[null],
      signature:[null, Validators.required],
      validation_id:[null],
      type:[null]
    });

    this.signaturesForm.insert(0, newForm);
  }

  addValidationSignatures() {
    this.signaturesForm.insert(0, this.newValidationSignature());
  }

  newValidationSignature(): FormGroup {
    return this.fb.group({
      signable_id:[this.pdp.id],
      personnel_id:[this.currentUser.id],
      date:[this.setDateFormat(new Date())],
      company_name:[null, Validators.required],
      full_name:[null, Validators.required],
      validation_at:[this.setDateFormat(new Date()), Validators.required],
      is_part_inspection:[0],
      part_inspection_at:[null],
      signature:[null, Validators.required],
      validation_id:[null],
      type:[null]
    });
  }

  removeSignature(i:number) {
    this.signaturesForm.removeAt(i);
  }

  clearSignature(i:number,type) {
    switch(type) {
      case 'ee': this.signaturePadEe.clear(); break;
      case 'eu': this.signaturePadEu.clear(); break;
      case 'ss': this.signaturePadSs.clear(); break;
      default: this.signaturePad.clear(); break;
    }
    this.signaturesForm.controls[i].get('signature').reset();
  }

  resizeSignaturePad(type = null) {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    switch(type) {
      case 'ee': this.signaturePadEe.set('canvasWidth', this.canvas['canvasWidth'] / ratio); break;
      case 'eu': this.signaturePadEu.set('canvasWidth', this.canvas['canvasWidth'] / ratio); break;
      case 'ss': this.signaturePadSs.set('canvasWidth', this.canvas['canvasWidth'] / ratio); break;
      default: this.signaturePad.set('canvasWidth', this.canvas['canvasWidth'] / ratio); break;
    }
  }
 
  drawComplete(i:number, type = null) {
    console.log(type);
    switch(type) {
      case 'ee': this.signaturesForm.controls[i].get('signature').setValue(this.signaturePadEe.toDataURL()); break;
      case 'eu': this.signaturesForm.controls[i].get('signature').setValue(this.signaturePadEu.toDataURL()); break;
      case 'ss': this.signaturesForm.controls[i].get('signature').setValue(this.signaturePadSs.toDataURL()); break;
      default: this.signaturesForm.controls[i].get('signature').setValue(this.signaturePad.toDataURL()); break;
    }
  }

  setDateFormat(date){
    return date ? moment(date).format('YYYY-MM-DD') : null;
  }

  async onSubmit(event){
    try {
      this.formloading = true;
        let form = {...this.signaturesForm.getRawValue()};
        this.formStatus.onFormSubmitting();

        this.pdpService.addSignatures(this.pdp.id, form)
          .toPromise()
          .then((signature) => {
            this.cdr.markForCheck();
            this.formloading = false;
            
            Swal.fire({
              icon: 'success',
              title: 'Votre signature a bien été prise en compte',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(['/plan-de-prevention/list']);
            });
          })
          .catch(err =>{ 

            this.formloading = false;
            Swal.fire({
              icon: 'error',
              title: this.translate.instant("ARS.NOTIF.INCOMPLETE_FORM.TITLE"),
              showConfirmButton: false,
              timer: 2000
            });

            if(err.status === 422){
              var messages = extractErrorMessagesFromErrorResponse(err);
              this.formStatus.onFormSubmitResponse({success: false, messages: messages});
              this.cdr.markForCheck();
            }

          });
          
        this.cdr.markForCheck();

    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  togglePartInspectionAt(event, index, FormChangeToControlName) {
		this.signaturesForm.controls[index].get(FormChangeToControlName).setValidators(event ? Validators.required : null);
		event ? this.signaturesForm.controls[index].get(FormChangeToControlName).enable() : this.signaturesForm.controls[index].get(FormChangeToControlName).disable();
		this.signaturesForm.controls[index].get(FormChangeToControlName).updateValueAndValidity();
  }
  
  isControlHasError(controlName: string, validationType: string, index = null): boolean {
      const control = this.signaturesForm.controls[index].get(controlName);
      if (!control) {
        return false;
      }
      return control.hasError(validationType) && (control.dirty || control.touched);
	}

}
