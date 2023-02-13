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
import { FileUploader } from 'ng2-file-upload';

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
  public uploader:FileUploader = new FileUploader({
    isHTML5: true
  });
  
  constructor(
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
  }
  
  createForm() {
		this.materielForm = this.materielFB.group({
      libelle: ['', Validators.required],
      numero_serie: [''],
      categorie_id: [null, Validators.required],
      size: [null],
      criteria_id: [null],
      subcategory_id: [null],
      description: [''],
      date_entree: [null],
      has_controle: [0],
      has_atex: [0],
      etat: [0],
      stock_disponible: [1],
      documentsToUpload:[null, null],
    });

		this.loaded = true;
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
          if(this.uploader.queue.length > 0){
            this.saveDocuments(materiel.id)
          }
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
  

	saveDocuments(materiel_id){

		let formData = new FormData();
		this.formStatus.onFormSubmitting();

		for (let j = 0; j < this.uploader.queue.length; j++) {
			let fileItem = this.uploader.queue[j]._file;
			formData.append('documents[]', fileItem);
		}

		this.materielService.addDocuments(materiel_id, formData)
			.toPromise()
			.then((res) => {
			
			})
			.catch(err =>{ 
				Swal.fire({
					icon: 'error',
					title: this.translate.instant("NOTIF.INCOMPLETE_FORM.TITLE"),
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

	onCancel() {
		this.location.back();
  }

  formatDates(item, direction){
    item.date_entree = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_entree) : this.dateEnToFrPipe.transform(item.date_entree);
  }
  
}
