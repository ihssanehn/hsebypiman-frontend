import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { DemandeEpisService } from '@app/core/services';
import { DemandeEpis } from '@app/core/models';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
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
          criteria_id: null,
          subcategory_id: null,
          size: null,
          displayExtraFields: false,
          displaySubcategory: false,
        })
      ]),
      delivery_type: [null, Validators.required],
      delivery_societe_nom: [null, Validators.compose([])],
      delivery_attention: [null, Validators.compose([])],
      delivery_nom: [null, Validators.compose([])],
      delivery_prenom: [null, Validators.compose([])],
      delivery_numero: [null, Validators.compose([])],
      delivery_rue: [null, Validators.compose([])],
      delivery_cp: [null, Validators.compose([])],
      delivery_ville: [null, Validators.compose([])],
      delivery_pays: [null, Validators.compose([])],
      bu_id: [null, Validators.compose([])],
      bu_autre: [null, Validators.compose([])],
    });

    const delivery_type = this.demandeEpisForm.get('delivery_type') as FormControl;
    const delivery_societe_nom = this.demandeEpisForm.get('delivery_societe_nom') as FormControl;
    const delivery_attention = this.demandeEpisForm.get('delivery_attention') as FormControl;
    const delivery_nom = this.demandeEpisForm.get('delivery_nom') as FormControl;
    const delivery_prenom = this.demandeEpisForm.get('delivery_prenom') as FormControl;
    const delivery_numero = this.demandeEpisForm.get('delivery_numero') as FormControl;
    const delivery_rue = this.demandeEpisForm.get('delivery_rue') as FormControl;
    const delivery_cp = this.demandeEpisForm.get('delivery_cp') as FormControl;
    const delivery_ville = this.demandeEpisForm.get('delivery_ville') as FormControl;
    const delivery_pays = this.demandeEpisForm.get('delivery_pays') as FormControl;
    const bu_id = this.demandeEpisForm.get('bu_id') as FormControl;
    const bu_autre = this.demandeEpisForm.get('bu_autre') as FormControl;

    delivery_type.valueChanges.subscribe(value=>{
      if(value == 3){
        bu_id.enable();
        bu_id.setValidators([Validators.required]);

        delivery_nom.disable();
        delivery_nom.setValidators([]);
        delivery_prenom.disable();
        delivery_prenom.setValidators([]);
        delivery_societe_nom.disable();
        delivery_societe_nom.setValidators([]);
        delivery_attention.disable();
        delivery_attention.setValidators([]);
        delivery_numero.disable()
        delivery_numero.setValidators([])
        delivery_rue.disable()
        delivery_rue.setValidators([])
        delivery_cp.disable()
        delivery_cp.setValidators([])
        delivery_ville.disable()
        delivery_ville.setValidators([])
        delivery_pays.disable()
        delivery_pays.setValidators([])
      }else{

        delivery_numero.enable();
        delivery_numero.setValidators([Validators.required]);
        delivery_rue.enable();
        delivery_rue.setValidators([Validators.required]);
        delivery_cp.enable();
        delivery_cp.setValidators([Validators.required]);
        delivery_ville.enable();
        delivery_ville.setValidators([Validators.required]);
        delivery_pays.enable();
        delivery_pays.setValidators([Validators.required]);

        if(value == 1){

          delivery_societe_nom.enable();
          delivery_societe_nom.setValidators([Validators.required]);
          delivery_attention.enable();
          delivery_attention.setValidators([Validators.required]);
          
          delivery_nom.disable();
          delivery_nom.setValidators([]);
          delivery_prenom.disable();
          delivery_prenom.setValidators([]);
          
        }else if(value == 2){
          
          delivery_nom.enable();
          delivery_nom.setValidators([Validators.required]);
          delivery_prenom.enable();
          delivery_prenom.setValidators([Validators.required]);

          delivery_societe_nom.disable();
          delivery_societe_nom.setValidators([]);
          delivery_attention.disable();
          delivery_attention.setValidators([]);

        }
      }
    })

		this.loaded = true;
  }
  
  async onSubmit(){

      this.formloading = true;
      let _datas = this.demandeEpisForm.getRawValue();

      await this.demandeEpisService.create(_datas).toPromise().then(res=>{
        Swal.fire({
          icon: 'success',
          title: this.translate.instant("DEMANDES_EPI.NOTIF.CREATED.TITLE"),
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
