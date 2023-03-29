import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TypeService, PersonnelService, MaterielService } from '@app/core/services';
import { Type, Materiel } from '@app/core/models';
import { SelectOptionModel } from '@app/core/_base/layout';

@Component({
  selector: 'tf-search-epi-form',
  templateUrl: './search-epi-form.component.html',
  styleUrls: ['./search-epi-form.component.scss']
})
export class SearchEpiFormComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() parent: string;
  @Input() origin: string;

  @Output() onEpiSelected = new EventEmitter();
  types: Type[];
  salaries: SelectOptionModel[] = [];
  epis: Materiel[];
  constructor(private typeService : TypeService,
    private salarieService : PersonnelService,
    private materielService : MaterielService,
    private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    var res = await this.typeService.getAllFromModel('VsEpi').toPromise(); 
    this.types = res.result.data
    this.salaries = (await this.salarieService.getList().toPromise()).result.data.map(user=>new SelectOptionModel(user.id, user.fullname));
    this.epis = (await this.materielService.getAllList({'categorie_code':'EPI'}).toPromise()).result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }



  cantDisplayQuestions(){
    var test: boolean = this.form.get('materiel_id').invalid ||
      this.form.get('type_id').invalid ||
      this.form.get('salarie_id').invalid
    return test;
  }  

  onSubmit(){
    this.onEpiSelected.emit(this.form);
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

  clearValue(key){
    this.form.get(key).patchValue(null);
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

  
  
  isExterne() {
    return this.form.get('is_externe').value == 1;
  }

  toggleExterne($event){
    if($event){
      this.form.get('is_externe').setValue(1);
    }else{
      this.form.get('is_externe').setValue(0);
    }
  }

}
