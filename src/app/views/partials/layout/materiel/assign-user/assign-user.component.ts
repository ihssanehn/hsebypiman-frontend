import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@app/core/services';
import { Type, Materiel } from '@app/core/models';
import moment from 'moment';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';



@Component({
  selector: 'tf-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.scss']
})
export class AssignUserComponent implements OnInit {

  form: FormGroup;

  @Input() origin: String;
  @Input() data: any = {};
  @Output() onUserSelected = new EventEmitter<any>();
  salaries: any;
  assigning: boolean = false;
  
  constructor(
    private salarieService : UserService,
    private fb : FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
    
  ) { }

  async ngOnInit() {
    console.log(this.origin)
    this.form = this.fb.group({
      salarie_id: [null, Validators.required],
      date_pret: [ moment().format('DD/MM/YYYY') ],
      date_retour: [null],
    })

    if(this.origin != 'add' && this.data != {}){
      var data = {... this.data}
      if(!data.date_retour){
        data.date_retour = moment().format()
      }
      this.formatDates(data, 'EnToFr');
      this.form.patchValue(data);
      this.form.get('salarie_id').disable();
    }

    this.salaries = (await this.salarieService.getList().toPromise()).result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.form && this.form.controls[controlName]){
      const control = this.form.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
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

  submitForm(){
    var form = this.form.value;
    this.formatDates(form, 'FrToEn');
    this.onUserSelected.emit(this.form.value);
  }

  clearValue(key){
    this.form.get(key).patchValue(null);
  }

  cancelAssigning(){
    this.form.patchValue(this.data);
    this.assigning = false;
  }

  
  formatDates(item, direction){
    item.date_pret = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_pret) : this.dateEnToFrPipe.transform(item.date_pret);
    item.date_retour = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_retour) : this.dateEnToFrPipe.transform(item.date_retour);
  }

}
