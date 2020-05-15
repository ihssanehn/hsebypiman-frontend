import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { ArDetailComponent } from '../ar-detail/ar-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ArService, ChantierService } from '@app/core/services';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
  selector: 'tf-ar-signature',
  templateUrl: './ar-signature.component.html',
  styleUrls: ['./ar-signature.component.scss']
})
export class ArSignatureComponent extends ArDetailComponent implements OnInit {

  signaturesForm: FormArray;

  formStatus = new FormStatus();

  private fb: FormBuilder;
  
  constructor(injector: Injector) {
    super(injector);
    this.fb = injector.get(FormBuilder);
  }

  ngOnInit() {
    super.ngOnInit();
    this.isDisableToggle = true;
    this.loaded = false;
  }

  createForm() {
    
    this.signaturesForm = this.fb.array([]);

    if(!this.ar.is_signed){
      this.signaturesForm.insert(0, 
        this.fb.group({
          signable_id:[null],
          date:[this.setDateFormat(new Date())],
          personnel:[null],
          personnel_id:[null],
          signataire_fullname:[null],
          entreprise_id:[null],
          signature:[null, Validators.required],
          commentaires:[null],
          remarks:[null],
        })
      );
    }

    this.loaded = true;
		this.cdr.detectChanges();
  }

  async getAr(arId: Number){
		try {
			var res = await this.arService.get(arId).toPromise();
			this.ar = res.result.data;
      this.getChantier(this.ar.chantier_id);
      this.createForm();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

  async onSubmit(event){

    try {
        let form = {...this.signaturesForm.value};
        this.formStatus.onFormSubmitting();

        this.arService.addSignatures(this.ar.id, form)
          .toPromise()
          .then((signature) => {
            console.log(signature);
            this.cdr.markForCheck();
            
            Swal.fire({
              icon: 'success',
              title: 'Votre signature a bien été prise en compte',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(['/analyses-risque/list']);
            });
          })
          .catch(err =>{ 

            Swal.fire({
              icon: 'error',
              title: 'Echec! le formulaire est incomplet',
              showConfirmButton: false,
              timer: 2000
            });

            if(err.status === 422){
              var messages = extractErrorMessagesFromErrorResponse(err);
              this.formStatus.onFormSubmitResponse({success: false, messages: messages});
              console.log(this.formStatus.errors, this.formStatus.canShowErrors());
              this.cdr.detectChanges();
              this.cdr.markForCheck();
            }

          });
          
        this.cdr.markForCheck();

    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  setDateFormat(date){
    return date ? moment(date).format('YYYY-MM-DD') : null;
  }

}
