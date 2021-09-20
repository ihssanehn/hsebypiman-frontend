import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
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
export class PdpSignatureComponent extends PdpDetailComponent implements OnInit {
  
  signaturesForm: FormArray;
  signable_id : number;
  currentUser : User;
  formStatus = new FormStatus();
  formloading: boolean= false;

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
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected pdpService: PdpService,
    protected cdr: ChangeDetectorRef,
    protected _sanitizer: DomSanitizer,
    protected authService: AuthService,
    protected fb: FormBuilder,
    protected translate: TranslateService
  ) {
    super(activatedRoute,router,pdpService,cdr,_sanitizer);
    this.authService.currentUser.subscribe(x=> this.currentUser = x);
  }

  ngOnInit() {
    this.createForm();
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.setSignableId(id);
          this.getPdp(id);
        } else {
          this.router.navigateByUrl('/plan-de-prevention/list');
        }
      }
    );
  }

  ngAfterViewInit() {
    if(this.signaturePad){
      this.signaturePad.set('minWidth', 0.5);
      this.signaturePad.clear();
    }
  }

  createForm() {
    this.signaturesForm = this.fb.array([]);
    var newForm = this.fb.group({
      signable_id:[null],
      personnel_id:[this.currentUser.id],
      date:[this.setDateFormat(new Date())],
      company_name:[null, Validators.required],
      full_name:[null, Validators.required],
      validation_at:[this.setDateFormat(new Date()), Validators.required],
      is_part_inspection:[0],
      part_inspection_at:[null],
      signature:[null, Validators.required]
    });

    this.signaturesForm.insert(0, newForm);
  }

  setSignableId(id){
    this.signable_id = id;
    (this.signaturesForm as FormArray)
      .controls[0]
      .get('signable_id')
      .setValue(id);
  }

  addSignatures() {
    this.signaturesForm.insert(0, this.newSignature());
  }

  newSignature(): FormGroup {
    return this.fb.group({
      signable_id:[this.signable_id],
      personnel_id:[this.currentUser.id],
      company_name:[null, Validators.required],
      full_name:[null, Validators.required],
      validation_at:[this.setDateFormat(new Date()), Validators.required],
      is_part_inspection:[0],
      part_inspection_at:[null],
      signature:[null, Validators.required],
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
