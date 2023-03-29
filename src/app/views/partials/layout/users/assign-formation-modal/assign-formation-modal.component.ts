import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import {FileUploader} from "ng2-file-upload";
import { Formation } from '@app/core/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormationService } from '@app/core/services';
import moment from 'moment';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-assign-formation-modal',
  templateUrl: './assign-formation-modal.component.html',
  styleUrls: ['./assign-formation-modal.component.scss']
})
export class AssignFormationModalComponent implements OnInit{

  form: FormGroup;
  user_id;
  formations: Formation[];
	formloading: boolean = false;
  uploader: FileUploader = new FileUploader({
    isHTML5: true
  });

  constructor(
    private formationService: FormationService,
    public activeModal: NgbActiveModal,
		private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private translate:TranslateService,
    private dateFrToEnPipe: DateFrToEnPipe,
    private dateEnToFrPipe: DateEnToFrPipe
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadFormations();
  }

  createForm() {
    this.formloading = true;
		this.form = this.fb.group({
      formation_id: [null, Validators.required],
      date_validite: [moment().format('DD/MM/YYYY'), Validators.required],
      documentsToUpload: [null, null]
    });
		this.formloading = false;
  }

  async loadFormations(){
		var res = await this.formationService.getList().toPromise();
		this.formations = res.result.data;
    console.log(this.formations);

    this.cdr.markForCheck();
  }

  async save(){
    this.formloading = true
    let formData = new FormData();
    let form = { ...this.form.getRawValue() };
    this.formatDates(form, 'FrToEn');

    for (let j = 0; j < this.uploader.queue.length; j++) {
      let fileItem = this.uploader.queue[j]._file;
      formData.append('documents[]', fileItem);
    }

    Object.keys(form).map(function (key) {
      if(form[key])
        return formData.append(key, form[key]);
    })

    formData.append('id_user', this.user_id)
    
    var res = await this.formationService.assignUsers(form.formation_id, formData).toPromise();
    if(res) {
      this.activeModal.close(res);
    }
    
  }

  closeModal(){
    this.activeModal.close();
  }

  formHasValue(key){
    return this.form.get(key).value ? true : false;
  }

  clearValue(key){
    this.form.get(key).patchValue(null);
  }

  formatDates(item, direction) {
    item.date_validite = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_validite) : this.dateEnToFrPipe.transform(item.date_validite);
  }

  controlDocuments(){
    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      if(fileItem.size > 10000000){
        alert(this.translate.instant("REMONTEES.NOTIF.FILE_SIZE_ALERT.TITLE"));
        return true;
      }
    }
    return false;
  }

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.form.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }

  seeItem(item){
    return item.file.name
  }

  isFieldRequired(controlName) {
    if (this.form && this.form.controls[controlName]) {
      const control = this.form.controls[controlName]
      const { validator } = control
      if (validator) {
        const validation = validator(new FormControl())
        return validation !== null && validation.required === true
      } else {
        return false;
      }
    }
  }

  onFileDrop(event){
    var extensions = ['pdf'];

    for (let i = 0; i < event.length; i++) {
      
      const droppedFile = event[i];
      var name = droppedFile.name.split('.');
      var ext = name[name.length -1].toLowerCase();
      
      let error = false;

      if( extensions.indexOf(ext) == -1 ){
        error = true;
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('UPLOAD.EXTENSION')+' '+droppedFile.name,
          showConfirmButton: false,
          timer: 1500
        });
      } else if (droppedFile.size > 4000000) {
        error = true;
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('UPLOAD.SIZE')+' '+droppedFile.name,
          showConfirmButton: false,
          timer: 1500
        });
      }

      if(error == true){
        this.uploader.queue = this.uploader.queue.filter(x=>x.file.name != droppedFile.name);
      }
    }
  }

}
