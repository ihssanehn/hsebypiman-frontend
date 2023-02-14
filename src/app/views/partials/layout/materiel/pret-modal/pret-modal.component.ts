import { Component, OnInit, Input, Inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PersonnelService } from '@app/core/services';
import { Type, Materiel } from '@app/core/models';
import moment from 'moment';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  origin: string;
  pivot: any;
}

@Component({
  selector: 'tf-pret-modal',
  templateUrl: './pret-modal.component.html',
  styleUrls: ['./pret-modal.component.scss']
})
export class PretModalComponent implements OnInit {

  form: FormGroup;

  salaries: any;
  formloading: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PretModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private salarieService: PersonnelService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe: DateFrToEnPipe,
    private dateEnToFrPipe: DateEnToFrPipe,

  ) { }

  async ngOnInit() {
    this.form = this.fb.group({
      salarie_id: [null, Validators.required],
      pret_id: [null],
      date_pret: [moment().format('DD/MM/YYYY')],
      is_given: [0],
      date_retour: [null],
    })

    this.form.get('is_given').valueChanges.subscribe(val=>{
      if(val == 1){
        this.form.get('date_retour').disable();
        this.form.get('date_retour').setValue(null);
      }else{
        this.form.get('date_retour').enable();
      }
    })

    if (this.data.origin != 'add' && this.data.pivot != {}) {
      var pivot = { ... this.data.pivot }

      if (!pivot.date_retour && !pivot.is_given) {
        pivot.date_retour = moment().format()
      }
      
      this.formatDates(pivot, 'EnToFr');
      this.form.patchValue(pivot);
      this.form.get('pret_id').setValue(pivot.id);
      this.form.get('salarie_id').disable();

      if (this.data.origin == 'return') {
        this.form.get('date_pret').disable();
      }
    }

    this.salaries = (await this.salarieService.getList().toPromise()).result.data;

    this.cdr.markForCheck();

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
    this.dialogRef.close(form);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  formatDates(item, direction) {
    item.date_pret = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_pret) : this.dateEnToFrPipe.transform(item.date_pret);
    if(!item.is_given){
      item.date_retour = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_retour) : this.dateEnToFrPipe.transform(item.date_retour);
    }
  }

}
