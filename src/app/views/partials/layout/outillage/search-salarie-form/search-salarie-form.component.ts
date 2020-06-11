import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService, User } from '@app/core/auth';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { TypeService } from '@app/core/services';
import { Type } from '@app/core/models';

@Component({
  selector: 'tf-search-salarie-form',
  templateUrl: './search-salarie-form.component.html',
  styleUrls: ['./search-salarie-form.component.scss']
})
export class SearchSalarieFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() parent: string;
  @Input() origin: string;
  

  @Output() onUserSelected = new EventEmitter();
  searchControl: FormControl = new FormControl();
  filteredSalaries : Observable<User[]>
  salaries: User[];
  salarie : User;
  types : Type[];
  constructor(private salarieService : AuthService,
    private cdr : ChangeDetectorRef,
    private typeService : TypeService) { }

  async ngOnInit() {
    this.salaries = (await this.salarieService.getList().toPromise()).result.data;
    this.initFilteredSalaries();
    this.getTypes();
  }

  async getTypes(){
    var res = await this.typeService.getAllFromModel('VsOutillage').toPromise();
    this.types = res.result.data
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }



  onSubmit(){
    this.onUserSelected.emit(this.form);
  }


  cantDisplayQuestions(){
    var test: boolean = this.form.get('outillage_code').invalid ||
      this.form.get('type_id').invalid ||
      this.form.get('salarie_id').invalid

    return test;
  }  

  async initFilteredSalaries(){
    var res = await this.salarieService.getList().toPromise();
    this.salaries = res.result.data;
    this.filteredSalaries = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }


  private _filter(value: string): Array<User> {
    const filterValue = value;
    return this.salaries.filter(user => 
      this._normalizeValue(user.nom + user.prenom).includes(filterValue)
    );
  }

  private _normalizeValue(value: String): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  displayFn(user: User): String {
    return user ? user.nom +' '+ user.prenom : '';
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
}
