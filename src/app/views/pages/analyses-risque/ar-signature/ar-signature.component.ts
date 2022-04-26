import { Component, OnInit, Injector } from '@angular/core';
import { ArDetailComponent } from '../ar-detail/ar-detail.component';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-ar-signature',
  templateUrl: './ar-signature.component.html',
  styleUrls: ['./ar-signature.component.scss']
})
export class ArSignatureComponent extends ArDetailComponent implements OnInit {

  signaturesForm: FormArray;

  formStatus = new FormStatus();
  formloading: boolean= false;

  private fb: FormBuilder;
  
  constructor(injector: Injector) {
    super(injector);
    this.fb = injector.get(FormBuilder);
    this.translate = injector.get(TranslateService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.loaded = false;
  }

  createForm() {
    
    this.isDisableToggle = true;
    this.isExpanded = true;
    this.signaturesForm = this.fb.array([]);
    var newForm = this.fb.group({
      signable_id:[null],
      date:[this.setDateFormat(new Date())],
      personnel:[null],
      personnel_id:[null],
      signataire_fullname:[null, [Validators.required]],
      entreprise_id:[null, [Validators.required]],
      signature:[null, [Validators.required]],
      commentaires:[null],
      remarks:[null],
    });

    newForm.get('personnel_id').valueChanges.subscribe(x=>{
      if(x){
        newForm.controls['entreprise_id'].clearValidators();
        newForm.controls['entreprise_id'].updateValueAndValidity();
        newForm.controls['signataire_fullname'].clearValidators();
        newForm.controls['signataire_fullname'].updateValueAndValidity();

        this.cdr.markForCheck();
      }
    })

    this.signaturesForm.insert(0, newForm);

    
    
    this.loaded = true;
  }

  async getAr(arId: Number){
		try {
			var res = await this.arService.get(arId).toPromise();
      this.ar = res.result.data;
      if(this.ar.status.code == "ARCHIV"){
        this.goBack();
      }else{
        this.chantier = this.ar.chantier
        // this.getChantier(this.ar.chantier_id);
        this.createForm();
        this.cdr.markForCheck();
      }
		} catch (error) {
			console.error(error);
		}
	}

  async onSubmit(event){
    try {
      this.formloading = true;
        let form = {...this.signaturesForm.getRawValue()};
        this.formStatus.onFormSubmitting();

        this.arService.addSignatures(this.ar.id, form)
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
              this.router.navigate(['/analyses-risque/list']);
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

  setDateFormat(date){
    return date ? moment(date).format('YYYY-MM-DD') : null;
  }

  goBack() {
		const url = `/analyses-risque/list`;
		this.router.navigateByUrl(url, { 
			relativeTo: this.activatedRoute 
		});
	}

}
