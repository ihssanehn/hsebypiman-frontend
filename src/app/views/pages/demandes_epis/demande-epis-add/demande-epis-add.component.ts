import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { DemandeEpisService } from '@app/core/services';
import { DemandeEpis } from '@app/core/models';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-demande-epis-add',
  templateUrl: './demande-epis-add.component.html',
  styleUrls: ['./demande-epis-add.component.scss']
})
export class DemandeEpisAddComponent implements OnInit {
  
  demandeEpis: DemandeEpis;
  demandeEpisForm: FormGroup;
  formStatus = new FormStatus();
  formloading: Boolean = false;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
  // Private properties
  errors;
  
  constructor(
		private router: Router,
		private remonteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private demandeEpisService: DemandeEpisService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private translate:TranslateService,
    public snackBar: MatSnackBar,
    private dateFrToEnPipe:DateFrToEnPipe,
  ) { }

  ngOnInit() {
    this.demandeEpis = new DemandeEpis();
    this.createForm();
  }

  createForm() {
		this.demandeEpisForm = this.remonteFB.group({
      epis: this.remonteFB.array([
        this.remonteFB.group({
          categorie_id: [null, Validators.required],
          qte: [1, Validators.compose([Validators.required, Validators.min(1)])],
          comment: [null],
        })
      ])
    });
		this.loaded = true;
  }

  
  async onSubmit(){

      this.formloading = true;
      let _datas = this.demandeEpisForm.getRawValue();

      await this.demandeEpisService.create(_datas).toPromise().then(res=>{
        Swal.fire({
          icon: 'success',
          title: this.translate.instant("DEMANDES_EPIS.NOTIF.CREATED.TITLE"),
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.location.back();
        });
      }).catch(error=>{
        console.log(error);
        this.formloading = false;
      })
        
      this.cdr.markForCheck();
  }
  
	onCancel() {
		this.location.back();
  }
  

  
}
