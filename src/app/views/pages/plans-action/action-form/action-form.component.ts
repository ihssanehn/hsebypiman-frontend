import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Type, Status, CatHabilitation, Entreprise } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { TypeService, StatusService, CatHabilitationService, EntrepriseService, UserService } from '@app/core/services';
import { first } from 'rxjs/operators';
import { FormStatus } from '@app/core/_base/crud/models/form-status';


@Component({
  selector: 'tf-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.scss']
})
export class ActionFormComponent implements OnInit {

  typesList: Type[];
  typesLoaded: boolean = false;
  usersList: User[];
  usersLoaded: boolean = false;
  statusList: Status[];
  statusLoaded: boolean = false;
  catHabsList: CatHabilitation[];
  catHabsLoaded: boolean = false;
  entreprisesList: Entreprise[];
  entreprisesLoaded: boolean = false;
  interimairesList: User[];
  interimairesLoaded: boolean = false;
  entrepriseTypesList: Type[];
  entrepriseTypesLoaded: boolean = false;

  @Input() actionForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Input() formloading: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  constructor(
    private typeService:TypeService,
    private fb: FormBuilder,
    private statusService:StatusService,
    private catHabilitationService:CatHabilitationService,
    private entrepriseService: EntrepriseService,
    private userService:UserService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTypes();
    this.getUsers();
    this.getStatus();
    this.getCatHabs();
    this.getEntreprises();
    this.getEntrepriseTypes();
    this.getInterimaires();
  }

  async getTypes(){
    this.typesLoaded = false;
    var res = await this.typeService.getAllFromModel('Action').toPromise();
    if(res){
      this.typesList = res.result.data;
      this.typesLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async getUsers(){
    this.usersLoaded = false;
    var res = await this.userService.getList().toPromise();
    if(res){
      this.usersList = res.result.data;
      this.usersLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async getStatus(){
    this.statusLoaded = false;
    var res = await this.statusService.getAllFromModel('Action').toPromise();
    if(res){
      this.statusList = res.result.data;
      this.statusLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async getCatHabs(){
    this.catHabsLoaded = false;
    var res = await this.catHabilitationService.getAll().toPromise();
    if(res){
      this.catHabsList = res.result.data;
      this.catHabsLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async getEntreprises(){
    this.entreprisesLoaded = false;
    var res = await this.entrepriseService.getListGrouped().toPromise();
    if(res){
      this.entreprisesList = res.result.data;
      this.entreprisesLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async getEntrepriseTypes(){
    this.entrepriseTypesLoaded = false;
    var res = await this.typeService.getAll({'model':'Entreprise'}).toPromise();
    if(res){
      this.entrepriseTypesList = res.result.data;
      this.entrepriseTypesLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async getInterimaires(){
    this.interimairesLoaded = false;
    var res = await this.userService.getAll({'categorie_code':'INTERIMAIRE', 'paginate':false}).toPromise();
    if(res){
      this.interimairesList = res.result.data;
      this.interimairesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  onNoHabCheckChange(event){
    const habs : FormArray = this.actionForm.get('habilitations') as FormArray;;
    if(this.actionForm.get('no_hab_required').value){
      habs.clear();
      habs.setValidators(null);
      habs.disable();
    }else{
      habs.setValidators([Validators.required]);
      habs.enable();
    }
  }

  onHabCheckChange(event) {
    const formArray: FormArray = this.actionForm.get('habilitations') as FormArray;
    if(event.checked){
      formArray.push(new FormControl(event.source.value));
    }
    else{
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.source.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  onHabIsChecked(habId){
    return this.actionForm.get('habilitations').value.includes(habId);
  }
  isFieldRequired(controlName){
    if(this.actionForm && this.actionForm.controls[controlName]){
      const control = this.actionForm.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }
  isEEFieldRequired(name, index){
    var ee = this.entreprises.controls[index] as FormGroup;
    return !!ee.controls[name].validator(name) && ee.controls[name].validator(name).hasOwnProperty('required');
    return true;
  }
  /**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.actionForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }
  
  submitForm(bool){
    if(bool){
      this.onSubmit.emit(bool)
    }
  }
  cancelForm(){
    this.onCancel.emit()
  }
  addEntExt(){
    this.entreprises.push(this.newEntreprises);
  }

  get entreprises(): FormArray{
    return this.actionForm.get('entreprises') as FormArray;
  }
  get newEntreprises(): FormGroup {

    var new_entreprise = this.fb.group({
      'type_code':[null, [Validators.required]],
      'entreprise_id':[null, [Validators.required]],
      'interimaire_id':[null, [Validators]],
      'chiffre_affaire':[null, [Validators]],
      'date_demarrage':[null, [Validators]]
    });
    new_entreprise.get('type_code').valueChanges.subscribe(code=>{
      if(code == 'SOUS_TRAITANT'){
        new_entreprise.get('interimaire_id').setValidators(null);
        new_entreprise.get('chiffre_affaire').setValidators(Validators.required);
      }else{
        new_entreprise.get('interimaire_id').setValidators(Validators.required);
        new_entreprise.get('chiffre_affaire').setValidators(null);
      }
    })
    return new_entreprise;
  }

  removeEe(i){
    this.entreprises.removeAt(i);
  }
  entHasCode(i){
    if(!this.entrepriseTypesLoaded){
      return false;
    }
    var entreprise : FormGroup = this.entreprises.controls[i] as FormGroup;
    var code = entreprise.controls['type_code'].value;
    return code;
  }
}
