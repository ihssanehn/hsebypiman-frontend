import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MaterielService } from '@app/core/services';
import { Materiel } from '@app/core/models';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  materiel: Materiel;
}

@Component({
  selector: 'tf-revision-modal',
  templateUrl: './revision-modal.component.html',
  styleUrls: ['./revision-modal.component.scss']
})
export class RevisionModalComponent implements OnInit {
 
  form: FormGroup;
  formloading: Boolean = false;
  etatOptions: Array<any>=[];

  constructor(
    public dialogRef: MatDialogRef<RevisionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private materielService: MaterielService,
    private dateFrToEnPipe: DateFrToEnPipe,
    private dateEnToFrPipe: DateEnToFrPipe,

  ) { }

  async ngOnInit() {
    this.formatDates(this.data.materiel, 'EnToFr');
    this.initEtatOptions()
    this.form = this.fb.group({
      date_derniere_revision: [this.data.materiel.date_derniere_revision],
      date_prochaine_revision: [this.data.materiel.date_prochaine_revision],
      etat: [this.data.materiel.etat, Validators.required],
      comment_revision: [this.data.materiel.comment_revision],
      revision: [this.data.materiel.revision],
    })

    this.cdr.markForCheck();
  }

  initEtatOptions(){
    if(this.data.materiel.main_categorie.code == "BATIMENT"){
        this.etatOptions = [
          {
            value: 0,
            title: "Oui"
          },
          {
            value: 1,
            title: "Non"
          }
        ]
    }else{
      this.etatOptions = [
        {
          value: 0,
          title: "Hors Service"
        },
        {
          value: 1,
          title: "Fonctionnel"
        }
      ]
    }
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

  /**
  * Checking control validation
  *
  * @param controlName: string => Equals to formControlName
  * @param validationType: string => Equals to valitors name
  */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  submitForm() {
    this.formloading = true;
    var form = { ...this.form.getRawValue() };

    this.formatDates(form, 'FrToEn');
    form.id = this.data.materiel.id;
    this.materielService.update(form).toPromise().then(res=>{
      this.dialogRef.close(res);
    })
  }

  cancel(): void {
    this.dialogRef.close();
  }

  formatDates(item, direction) {
    item.date_derniere_revision = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_derniere_revision) : this.dateEnToFrPipe.transform(item.date_derniere_revision);
    item.date_prochaine_revision = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_prochaine_revision) : this.dateEnToFrPipe.transform(item.date_prochaine_revision);
  }

}
