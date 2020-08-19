import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Personnel } from '@app/core/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { Router } from '@angular/router';
import { PersonnelService } from '@app/core/services';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-salarie-add',
  templateUrl: './salarie-add.component.html',
  styleUrls: ['./salarie-add.component.scss']
})
export class SalarieAddComponent implements OnInit {

  salarie: Personnel;
  salarieForm: FormGroup;
  formStatus = new FormStatus();
  formloading: Boolean = false;
  loaded = false;
  errors;


  constructor(
    private router: Router,
    private salarieFB: FormBuilder,
    private personnelService: PersonnelService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
  ) { }

  ngOnInit() {
    this.salarie = new Personnel();
    this.createForm();
    this.setDynamicValidators();
  }

  createForm() {
		this.salarieForm = this.salarieFB.group({
      civilite: ['', Validators],
      nom: [null, Validators.required],
      prenom: ['', Validators.required],
      date_naissance: ['', [Validators]],
      email: ['', Validators.required],
      telephone: ['', [Validators]],
      date_entree: ['', Validators.required],
      date_sortie: ['', [Validators]],
      fonction_id: ['', [Validators]],
      nom_urgence: ['', [Validators]],
      telephone_urgence: ['', [Validators]],
      lien_parente_urgence: ['', [Validators]],
      rqth: ['', [Validators]],
      date_visite_medicale_passed: ['', [Validators]],
      date_visite_medicale_next: ['', [Validators]]
    });
		this.loaded = true;
  }

  setDynamicValidators(){
    //const no_hab_required = this.salarieForm.get('no_hab_required');
  }

  async onSubmit(){
    try {
      let result;
      this.formloading = true;
      let form = {...this.salarieForm.getRawValue()};
      this.parseDates(form, 'FrToEn');
      this.formStatus.onFormSubmitting();
  
			this.personnelService.create(form)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var salarie = res.result.data;
          Swal.fire({
            icon: 'success',
            title: 'Salarié créé avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/salaries/detail/' + salarie.id]);
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

  parseDates(item, direction){
		item.date_naissance = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_naissance) : this.dateEnToFrPipe.transform(item.date_naissance);
    item.date_entree = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_entree) : this.dateEnToFrPipe.transform(item.date_entree);
    item.date_sortie = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_sortie) : this.dateEnToFrPipe.transform(item.date_sortie);
    item.date_visite_medicale_passed = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_visite_medicale_passed) : this.dateEnToFrPipe.transform(item.date_visite_medicale_passed);
    item.date_visite_medicale_next = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_visite_medicale_next) : this.dateEnToFrPipe.transform(item.date_visite_medicale_next);
  }

  onCancel() {
		this.location.back();
  }

}
