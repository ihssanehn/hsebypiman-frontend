import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Location } from '@angular/common';
import { MaterielService} from '@app/core/services';
import { Materiel} from '@app/core/models';
import { MatSnackBar } from '@angular/material';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-materiel-add',
  templateUrl: './materiel-add.component.html',
  styleUrls: ['./materiel-add.component.scss']
})
export class MaterielAddComponent implements OnInit {
  
  materiel: Materiel;
  materielForm: FormGroup;
  formStatus = new FormStatus();
  formloading: Boolean = false;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
  // Private properties
  errors;
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private materielFB: FormBuilder,
		// private notificationService: NzNotificationService,
    private materielService: MaterielService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    public snackBar: MatSnackBar,    
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
  ) { }

  ngOnInit() {
    this.materiel = new Materiel();
    this.createForm();
    this.setDynamicValidators();
  }
  
  createForm() {
		this.materielForm = this.materielFB.group({
      
      libelle: ['', Validators.required],
      code: [null],
      numero_serie: [''],
      categorie_id: [null, Validators.required],
      marque: [''],
      description: [''],
      fournisseur: [''],
      date_entree: [null],
      date_sortie: [null],
      formation_requise: [0],
      habilitation_requise: [0],
      has_controle: [0],
      is_active: [1],
      is_stock_commun: [0],
      frequence_controle: [null],
      is_location: [0],
      cout: [null],
      date_fin_garantie: [null]
    });

		this.loaded = true;
  }

  setDynamicValidators(){
    const has_controle = this.materielForm.get('has_controle');
    const frequence_controle = this.materielForm.get('frequence_controle');
    
    has_controle.valueChanges.subscribe(x=>{
      if(x == 1){
        frequence_controle.enable();
      }else{
        frequence_controle.disable();
      }
    })
  }
  
  async onSubmit(){
    try {
      let result;
      this.formloading = true;
      let form = {...this.materielForm.getRawValue()};
      this.formatDates(form, 'FrToEn');

      this.formStatus.onFormSubmitting();
  
			this.materielService.create(form)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var materiel = res.result.data;
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("MATERIELS.NOTIF.MATERIEL_CREATED.TITLE"),
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/materiel/detail/' + materiel.id]);
          });
        })
        .catch(err =>{ 
          this.formloading = false;

          Swal.fire({
            icon: 'error',
            title: this.translate.instant("ARS.NOTIF.INCOMPLETE_FORM.TITLE"),
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

  formatDates(item, direction){
    item.date_entree = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_entree) : this.dateEnToFrPipe.transform(item.date_entree);
    item.date_sortie = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_sortie) : this.dateEnToFrPipe.transform(item.date_sortie);
    item.date_fin_garantie = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_fin_garantie) : this.dateEnToFrPipe.transform(item.date_fin_garantie);
  }
  
}
