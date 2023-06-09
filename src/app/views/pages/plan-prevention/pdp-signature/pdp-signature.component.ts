import { ChangeDetectorRef, Component, Input, OnInit, Output, QueryList, ViewChildren, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from '@app/core/auth';
import { Pdp, Status } from '@app/core/models';
import { PdpService } from '@app/core/services';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import moment from 'moment';
import Swal from 'sweetalert2';
import { GuestService } from '@app/core/auth/_services/guest.service';

@Component({
  selector: 'tf-pdp-signature',
  templateUrl: './pdp-signature.component.html',
  styleUrls: ['./pdp-signature.component.scss']
})
export class PdpSignatureComponent implements OnInit {

  @Input() pdp: Pdp;
  @Input() public type: string;
  @Input() fromGuest: any;

  @Output() signEvent = new EventEmitter<boolean>();

  signaturesForm: FormArray;
  currentUser : User;
  formStatus = new FormStatus();
  formloading: boolean= false;
  selectedButton : number[] = Array(1).fill(0);

  @ViewChildren("signaturePad") signaturePads: QueryList<SignaturePad>;

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

  status : Status[];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected pdpService: PdpService,
    protected cdr: ChangeDetectorRef,
    protected _sanitizer: DomSanitizer,
    protected authService: AuthService,
    protected fb: FormBuilder,
    protected translate: TranslateService,
    protected guestService: GuestService,
  ) {
    this.authService.currentUser.subscribe(x=> this.currentUser = x);
  }

  ngOnInit() {
    if(!this.fromGuest){
      this.getStatus();
    }
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
    if(this.signaturePads){
      this.signaturePads.forEach((child) => {
        child.set('minWidth', 0.5);
        child.clear();
      });
    }
  }

  parseValidations(validations) {
    if(validations.filter(element => !element.signature).length) {
      this.initValidationForm(validations);
    } else {
      this.createValidationForm();
    }
  }

  parseIntervenants(intervenants) {
    if(intervenants.filter(element => !element.signature).length) {
      this.initIntervenantForm(intervenants);
    } else {
      this.createIntervenantForm();
    }
  }

  initValidationForm(validations) {
    validations
      .filter(element => {
        if(this.fromGuest){
          return !element.signature && (element.id == this.fromGuest.itemId);
        }else{
          return !element.signature;
        }
      })
      .forEach((element,index) => {
        var newForm = this.fb.group({
          signable_id:[this.pdp.id],
          personnel_id:[this.currentUser ? this.currentUser.id : null],
          date:[this.setDateFormat(new Date())],
          company_name:[element.company_name, Validators.required],
          full_name:[element.full_name, Validators.required],
          validation_at:[this.setDateFormat(new Date()), Validators.required],
          is_part_inspection:[element.is_part_inspection],
          part_inspection_at:[element.is_part_inspection? this.setDateFormat(element.part_inspection_at): null],
          signature:[null, Validators.required],
          validation_id:[element.id],
          type:[element.type],
		      read_and_approved:[false,Validators.requiredTrue]
        });

        this.signaturesForm.insert(index, newForm);
    });
  }

  initIntervenantForm(intervenants) {
    intervenants
      .filter(element => !element.signature)
      .forEach((element,index) => {
        var newForm = this.fb.group({
          signable_id:[this.pdp.id],
          personnel_id:[this.currentUser.id],
          date:[this.setDateFormat(new Date())],
          first_name:[element.first_name, Validators.required],
          last_name:[element.last_name, Validators.required],
          signature:[null, Validators.required],
          intervenant_id:[element.id],
		      read_and_approved:[false,Validators.requiredTrue]
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
      type:[null],
      read_and_approved:[false,Validators.requiredTrue]
    });

    this.signaturesForm.insert(0, newForm);
  }

  createIntervenantForm() {
    var newForm = this.fb.group({
      signable_id:[this.pdp.id],
      personnel_id:[this.currentUser.id],
      date:[this.setDateFormat(new Date())],
      first_name:[null, Validators.required],
      last_name:[null, Validators.required],
      signature:[null, Validators.required],
      intervenant_id:[null],
      read_and_approved:[false,Validators.requiredTrue]
    });

    this.signaturesForm.insert(0, newForm);
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
      type:[null],
      read_and_approved:[false,Validators.requiredTrue]
    });
  }

  newIntervenantSignature(): FormGroup {
    return this.fb.group({
      signable_id:[this.pdp.id],
      personnel_id:[this.currentUser.id],
      date:[this.setDateFormat(new Date())],
      first_name:[null, Validators.required],
      last_name:[null, Validators.required],
      signature:[null, Validators.required],
      intervenant_id:[null],
      read_and_approved:[false,Validators.requiredTrue]
    });
  }

  addSignatures() {
    switch(this.type) {
      case 'pdp_validations':
          this.signaturesForm.insert(0, this.newValidationSignature());
          break;
      case 'pdp_intervenants':
          this.signaturesForm.insert(0, this.newIntervenantSignature());
          break;
    }
  }

  removeSignature(i:number) {
    this.signaturesForm.removeAt(i);
  }

  clearSignature(i:number) {
    let signaturePadChild = this.signaturePads.filter((element, index) => index === i);
    signaturePadChild[0].clear();
    this.signaturesForm.controls[i].get('signature').reset();
  }

  resizeSignaturePad() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signaturePads.forEach((child) => {
      child.set('canvasWidth', this.canvas['canvasWidth'] / ratio);
    });
  }

  drawComplete(i:number) {
    let signaturePadChild = this.signaturePads.filter((element, index) => index === i);
    this.signaturesForm.controls[i].get('signature').setValue(signaturePadChild[0].toDataURL());
  }

  setDateFormat(date){
    return date ? moment(date).format('YYYY-MM-DD') : null;
  }

  async onSubmit(){
    try {

      switch(this.type) {
        case 'pdp_validations':
            this.createValidationSignature();
            break;
        case 'pdp_intervenants':
            this.createIntervenantSignature();
            break;
      }

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  sendSignEvent() {
    this.signEvent.emit(true);
  }

  createValidationSignature() {
    this.formloading = true;
    let form = {...this.signaturesForm.getRawValue()};
    this.formStatus.onFormSubmitting();

    //Set the next Status thanks to the order property.
    if(this.fromGuest){
      var data = {
        item_id: this.fromGuest.itemId,
        item_type: this.fromGuest.itemType,
        token: this.fromGuest.token,
        ...form[0],
      }
      this.guestService.updateItem(data).toPromise().then((signature) => {
        this.cdr.markForCheck();
        this.formloading = false;
        Swal.fire({
          icon: 'success',
          title: 'Votre signature a bien été prise en compte',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.sendSignEvent();
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
    }else{

      const status = {
        "status" : this.status.find(status => status.ordre == 2)
      }
      this.pdpService.changeStatus(this.pdp.id,status).subscribe((res)=>{});
      
      this.pdpService.addValidationSignatures(this.pdp.id, form)
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
            //this.router.navigate(['/plan-de-prevention/list']);
            this.sendSignEvent();
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
    }

    this.cdr.markForCheck();
  }

  createIntervenantSignature() {
    this.formloading = true;
    let form = {...this.signaturesForm.getRawValue()};
    this.formStatus.onFormSubmitting();
	const status = {
		"status" : this.status.find(status => status.ordre == 4)
	}
    this.pdpService.changeStatus(this.pdp.id,status).subscribe((res)=>{
		console.log(res);
	});
    this.pdpService.addIntervenantSignatures(this.pdp.id, form)
      .toPromise()
      .then(() => {
        this.cdr.markForCheck();
        this.formloading = false;

        Swal.fire({
          icon: 'success',
          title: 'Votre signature a bien été prise en compte',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          //this.router.navigate(['/plan-de-prevention/list']);
          this.sendSignEvent();
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

	getStatus(){
		this.pdpService.getStatus().subscribe((res : any)=>{
			this.status = res.result.data;
		});
	}

}
