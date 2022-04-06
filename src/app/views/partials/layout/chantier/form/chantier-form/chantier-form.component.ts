import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Type, Status, CatHabilitation, Entreprise } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { TypeService, StatusService, CatHabilitationService, EntrepriseService, PersonnelService } from '@app/core/services';
import { first } from 'rxjs/operators';
import { FormStatus } from '@app/core/_base/crud/models/form-status';


@Component({
  selector: 'tf-chantier-form',
  templateUrl: './chantier-form.component.html',
  styleUrls: ['./chantier-form.component.scss']
})
export class ChantierFormComponent implements OnInit {

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
  interimairesListGrouped: any;

  @Input() chantierForm: FormGroup;
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
    private userService:PersonnelService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadTypes();
    this.loadUsers();
    this.loadStatus();
    this.loadCatHabs();
    this.loadEntreprises();
    this.loadEntrepriseTypes();
    this.loadInterimaires();
  }

  async loadTypes(){
    this.typesLoaded = false;
    var res = await this.typeService.getAllFromModel('Chantier').toPromise();
    if(res){
      this.typesList = res.result.data;
      this.typesLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async loadUsers(){
    this.usersLoaded = false;
    var res = await this.userService.getList().toPromise();
    if(res){
      this.usersList = res.result.data;
      this.usersLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async loadStatus(){
    this.statusLoaded = false;
    var res = await this.statusService.getAllFromModel('Chantier').toPromise();
    if(res){
      this.statusList = res.result.data;
      this.statusLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async loadCatHabs(){
    this.catHabsLoaded = false;
    var res = await this.catHabilitationService.getAll().toPromise();
    if(res){
      this.catHabsList = res.result.data;
      this.catHabsLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async loadEntreprises(){
    this.entreprisesLoaded = false;
    var res = await this.entrepriseService.getListGrouped().toPromise();
    if(res){
      this.entreprisesList = res.result.data;
      this.entreprisesLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async loadEntrepriseTypes(){
    this.entrepriseTypesLoaded = false;
    var res = await this.typeService.getAll({'model':'Entreprise'}).toPromise();
    if(res){
      this.entrepriseTypesList = res.result.data;
      this.entrepriseTypesLoaded = true;
    }
    this.cdr.markForCheck();
  }
  async loadInterimaires(){

    var groupBy = function(xs, key) {
      
      var array = [];

      var test = xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});

      Object.keys(test).sort().forEach(x=>{
        if(x == 'null'){
          array.push({
            key: 'Autre', 
            values: test[x]  
          })
        }else{
          array.push({
            key: x, 
            values: test[x]
          })
        }
      });

      return array;
    };


    this.interimairesLoaded = false;
    var res = await this.userService.getAll({'contrat_code':'INTERIMAIRE', 'paginate':false, 'with_histo':true}).toPromise();
    if(res){
      this.interimairesList = res.result.data;
      this.interimairesListGrouped = groupBy(res.result.data, 'entreprise_interim');
      this.interimairesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  onNoHabCheckChange(event){
    const habs : FormArray = this.chantierForm.get('habilitations') as FormArray;;
    if(this.chantierForm.get('no_hab_required').value){
      habs.clear();
      habs.setValidators(null);
      habs.disable();
    }else{
      habs.setValidators([Validators.required]);
      habs.enable();
    }
  }

  onHabCheckChange(event) {
    const formArray: FormArray = this.chantierForm.get('habilitations') as FormArray;
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
    return this.chantierForm.get('habilitations').value.includes(habId);
  }
  isFieldRequired(controlName){
    if(this.chantierForm && this.chantierForm.controls[controlName]){
      const control = this.chantierForm.controls[controlName]
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
    
  }
  isINTFieldRequired(name, eeIndex, intIndex){
    var int = this.getInterimaire(eeIndex, intIndex) as FormGroup;
    return int && !!int.controls[name].validator(name) && int.controls[name].validator(name).hasOwnProperty('required');
  }
  /**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.chantierForm.controls[controlName];
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

  // ENTREPRISES
  get entreprises(): FormArray{
    return this.chantierForm.get('entreprises') as FormArray;
  }

  get newEntreprises(): FormGroup {

    var new_entreprise = this.fb.group({
      'type_code':[null, [Validators.required]],
      'entreprise_id':[null, [Validators.required]],
      // 'interimaire_id':[null, [Validators]],
      'chiffre_affaire':[null, [Validators]],
      'date_demarrage':[null, [Validators]],
      'interimaires': this.fb.array([])
    });
    new_entreprise.get('type_code').valueChanges.subscribe(code=>{
      if(code == 'SOUS_TRAITANT'){
        (new_entreprise.controls['interimaires'] as FormArray).clear();
        new_entreprise.controls['entreprise_id'].setValue(null);
        new_entreprise.get('chiffre_affaire').setValidators(Validators.required)
      }else{  
        new_entreprise.controls['entreprise_id'].setValue(null);
        new_entreprise.get('chiffre_affaire').setValidators(null);
        new_entreprise.get('chiffre_affaire').setValue(null);
      }
    })
    return new_entreprise;
  }

  // filterInterimairesList(i){
  //   var entreprise : FormGroup = this.entreprises.controls[i] as FormGroup;
  //   var agence = entreprise.controls['entreprise_interim'].value;
  //   return this.interimairesList.filter(user=>user.entreprise_interim == agence);
  // }

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

 
  // INTERIMAIRES

  get newInterimaire(): FormGroup{
    var new_interimaire = this.fb.group({
      'interimaire_id': [null, [Validators.required]],
      'date_debut_mission': [null,[Validators]],
      'date_fin_mission': [null,[Validators]],
    })

    return new_interimaire;
  }

  entHasInterimaires(i){
    var entreprise : FormGroup = this.entreprises.controls[i] as FormGroup;
    return entreprise.get('interimaires').value.length > 0;
  }

  getInterimaires(eeIndex){
    const entreprise = (this.chantierForm.get('entreprises') as FormArray).at(eeIndex) as FormGroup;
    if (!entreprise) return null;

    return (entreprise.get('interimaires') as FormArray);
  }
  
  addInterimaire(i){
    var ints:FormArray = this.getInterimaires(i);
    var new_interimaire = this.fb.group({
      'interimaire_id': [null, [Validators.required]],
      'date_debut_mission': [null, [Validators]],
      'date_fin_mission': [null, [Validators]],
    })  
    ints.push(new_interimaire);
  }

  removeInt(entIdx, intIdx){
    this.getInterimaires(entIdx).removeAt(intIdx);
  }

  getInterimaire(eeIndex, intIndex): FormGroup {
    const entreprise = (this.chantierForm.get('entreprises') as FormArray).at(eeIndex) as FormGroup;
    if (!entreprise) return null; 

    const interimaires = entreprise.get('interimaires') as FormArray;
    const interimaire = interimaires.at(intIndex) as FormGroup;
    
    return interimaire;
  }
  
  formHasValue(key){
    return this.chantierForm.get(key).value ? true:false;
  }
  clearValue(key){
    this.chantierForm.get(key).patchValue(null);
  }
}
