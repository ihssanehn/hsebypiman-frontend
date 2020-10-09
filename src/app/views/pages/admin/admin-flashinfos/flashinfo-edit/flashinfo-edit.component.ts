import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { Personnel } from '@app/core/models';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashInfoService } from '@app/core/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { FlashInfo } from '@app/core/models';

@Component({
  selector: 'tf-flashinfo-edit',
  templateUrl: './flashinfo-edit.component.html',
  styleUrls: ['./flashinfo-edit.component.scss']
})
export class FlashInfoEditComponent implements OnInit, OnDestroy {

	// allRoles: Role[];
  loaded = false;
  flashinfo: FlashInfo;
  flashinfoForm: FormGroup;
  formStatus = new FormStatus();
  formloading: boolean = false;
	// Private properties
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
    private FlashInfoService: FlashInfoService,
		private cdr: ChangeDetectorRef,
		private dateFrToEnPipe:DateFrToEnPipe,
		private dateEnToFrPipe:DateEnToFrPipe,
		private location: Location,
		private permissionsService : NgxPermissionsService
  ) {}

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.getFlashInfo(id).then(()=>{
            this.createForm();
            this.patchForm(this.flashinfo);
          });
        } else {
          this.router.navigateByUrl('/admin/flash-infos/list');
        }
      }
    );
  }
  
  async getFlashInfo(flashinfoId){
		try {
      var res = await this.FlashInfoService.get(flashinfoId).toPromise();
      let flashinfo = res.result.data;
      this.flashinfo = flashinfo;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  
  createForm() {
		this.flashinfoForm = this.fb.group({
      title: [{value:'', disabled:false}, Validators.required],
      content: [{value:'', disabled:false}, Validators.required],
      is_visible: [1, Validators.required],
      on_top: [1, Validators.required],
    });
    this.loaded = true;
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


  patchForm(item){
    this.flashinfoForm.patchValue(item);
  }
      
  onSubmit(){
    this.formloading = true;
    let form = {...this.flashinfoForm.getRawValue()};
    form.id = this.flashinfo.id;
    this.FlashInfoService.update(form)
      .toPromise()
      .then((res) => {
        console.log(res);
        this.formloading = false;
        Swal.fire({
          icon: 'success',
          title: 'Flash info mis à jour avec succès',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.location.back();
        });
        this.cdr.markForCheck();
      })
      .catch(err => {
        console.log(err);
        this.formloading = false;
        Swal.fire({
          icon: 'error',
          title: 'Echec! le formulaire est incomplet',
          showConfirmButton: false,
          timer: 1500
        });
    
        if(err.status === 422){
          var messages = extractErrorMessagesFromErrorResponse(err);
          this.formStatus.onFormSubmitResponse({success: false, messages: messages});
          this.cdr.markForCheck();
        }
      });
    this.cdr.markForCheck();
  }

  onCancel(){
    this.location.back();
  }


}
