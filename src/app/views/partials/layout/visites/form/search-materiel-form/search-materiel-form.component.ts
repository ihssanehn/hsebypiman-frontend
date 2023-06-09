import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '@app/core/auth';
import { Materiel, Type } from '@app/core/models';
import { MaterielService, PersonnelService, TypeService } from '@app/core/services';
import { SelectOptionModel } from '@app/core/_base/layout';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'tf-search-materiel-form',
  templateUrl: './search-materiel-form.component.html',
  styleUrls: ['./search-materiel-form.component.scss']
})
export class SearchMaterielFormComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() parent: string;
  @Input() origin: string;
  @Input() model: string;

  @Output() onUserSelected = new EventEmitter();

  searchControl: FormControl = new FormControl();
  filteredSalaries: Observable<User[]>
  salaries: SelectOptionModel[] = [];
  materiels: Materiel[] = [];
  salarie: User;
  types: Type[];

  constructor(
    private salarieService: PersonnelService,
    private cdr: ChangeDetectorRef,
    private typeService: TypeService,
    private materielService: MaterielService,
  ) {
  }

  async ngOnInit() {
    if (this.model != 'VsVehicule') {
      this.form.get('salarie_id').valueChanges.subscribe(salarie_id => {
        this.getMateriel(salarie_id);
      });
    } else {
      this.getMateriel(null);
    }
    this.salaries = (await this.salarieService.getList().toPromise()).result.data.map(user => new SelectOptionModel(user.id, user.fullname));
    this.initFilteredSalaries();
    this.getTypes();
  }

  async getTypes() {
    var res = await this.typeService.getAllFromModel(this.model).toPromise();
    this.types = res.result.data
    this.cdr.markForCheck();
  }

  async getMateriel(personnel_id = null) {
    switch (this.model) {
      default:
        var categorie_code = this.model.replace('Vs', '');
        this.materiels = (await this.materielService.getAllList({ 'categorie_code': categorie_code.toUpperCase(), 'actual_user_id': personnel_id }).toPromise()).result.data;
        break;
      case 'VsVehicule':
        var categorie_code = this.model.replace('Vs', '');
        this.materiels = (await this.materielService.getAllList({ 'categorie_code': categorie_code.toUpperCase(), 'actual_user_id': personnel_id }).toPromise()).result.data;
        break;
    }
    this.cdr.markForCheck();
  }



  onSubmit() {
    this.onUserSelected.emit(this.form);
  }


  cantDisplayQuestions() {

    var test: boolean = this.form.get('visitable_id').invalid
      || this.form.get('type_id').invalid
      || this.form.get('salarie_id').invalid
      || (this.model == 'VsVehicule' && this.form.get('vehicule_km').invalid)

    return test;
  }

  async initFilteredSalaries() {
    var res = await this.salarieService.getList().toPromise();
    this.salaries = res.result.data.map(user => new SelectOptionModel(user.id, user.fullname));
    this.filteredSalaries = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }


  private _filter(value: string): Array<User> {
    const filterValue = value;
    return this.salaries.filter(user =>
      this._normalizeValue(user.name).includes(filterValue)
    );
  }

  private _normalizeValue(value: String): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  displayFn(user: User): String {
    return user ? user.nom + ' ' + user.prenom : '';
  }

  isFieldRequired(controlName) {
    if (this.form && this.form.controls[controlName]) {
      const control = this.form.controls[controlName]
      const { validator } = control
      if (validator) {
        const validation = validator(new FormControl())
        return validation !== null && validation.required === true
      }
    }
  }

  clearValue(key) {
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

  toggleExterne($event) {
    if ($event) {
      this.form.get('is_externe').setValue(1);
    } else {
      this.form.get('is_externe').setValue(0);
    }
  }

  formHasMateriel() {
    return !this.form.get('visitable_id').value;
  }


}
