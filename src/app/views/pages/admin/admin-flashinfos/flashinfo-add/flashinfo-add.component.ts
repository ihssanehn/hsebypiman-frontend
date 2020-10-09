import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Personnel } from '@app/core/models';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { Router } from '@angular/router';
import { FlashInfoService } from '@app/core/services';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-flashinfo-add',
  templateUrl: './flashinfo-add.component.html',
  styleUrls: ['./flashinfo-add.component.scss']
})
export class FlashInfoAddComponent implements OnInit {

  flashinfo: Personnel;
  flashinfoForm: FormGroup;
  formStatus = new FormStatus();
  formloading: Boolean = false;
  loaded = false;
  errors;


  constructor(
    private router: Router,
    private flashinfoFB: FormBuilder,
    private FlashInfoService: FlashInfoService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
  ) { }

  ngOnInit() {
    this.flashinfo = new Personnel();
    this.createForm();
  }

  createForm() {
		this.flashinfoForm = this.flashinfoFB.group({
      title: [{value:'', disabled:false}, Validators.required],
      content: [{value:'', disabled:false}, Validators.required],
      is_visible: [1, Validators.required],
      on_top: [1, Validators.required],
    });
    this.loaded = true;
  }


  async onSubmit(){
    try {
      let result;
      this.formloading = true;
      let form = {...this.flashinfoForm.getRawValue()};

			this.FlashInfoService.create(form)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var flashinfo = res.result.data;
          Swal.fire({
            icon: 'success',
            title: 'Flash Info créé avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['admin/flash-infos/detail/' + flashinfo.id]);
          });
        })
        .catch(err =>{ 
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
    } catch (error) {
      this.formloading = false;
      console.error(error);
      throw error;
    }

  }

  onCancel() {
		this.location.back();
  }

}
