
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl, Validators } from '@angular/forms';
import { AuthService, User } from '@app/core/auth';
import { Type, Status, Entreprise } from '@app/core/models';
import { TypeService, StatusService, EntrepriseService } from '@app/core/services';
import { first } from 'rxjs/operators';


@Component({
  selector: 'tf-vs-form-head',
  templateUrl: './vs-form-head.component.html',
  styleUrls: ['./vs-form-head.component.scss']
})
export class VsFormHeadComponent implements OnInit {

  types: Type[];
  users: User[];
  status: Status[];
  entreprises: Entreprise[];
  entreprisesGrouped: any;
  entrepriseSelected: Entreprise = null;
  interimairesList: User[];
  redacteur: User;

  @Input() visiteForm: FormGroup;
  @Input() origin: string;
  @Input() edit: Boolean;
  @Input() model: string;
  constructor(
    private typeService:TypeService,
    private statusService:StatusService,
    private authService:AuthService,
    private entrepriseService:EntrepriseService,
    private cdr: ChangeDetectorRef,
  ) { }


  
  ngOnInit() {

    console.log();
    this.authService.getCurrentUser().subscribe((value)=>{console.log(value)})
    this.getTypes();
    this.getUsers();
    this.getStatus();
    this.getInterimaires();
    this.getEntreprises();
    
    if(origin == 'VsChantier'){
      this.setDynamicEntreprise();
    }
  }

  async getTypes(){
    var res = await this.typeService.getAllFromModel(this.model).toPromise();
    this.types = res.result.data
    this.cdr.markForCheck();
  }
  async getUsers(){
    var res = await this.authService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.markForCheck();
    this.redacteur = this.users.filter(x=>x.id == this.visiteForm.get('redacteur_id').value)[0];
  }
  async getStatus(){
    var res = await this.statusService.getAllFromModel('VsChantier').toPromise();
    this.status = res.result.data;
    this.cdr.markForCheck();
  }
  async getEntreprises(){
    var res = await this.entrepriseService.getList().toPromise();
    this.entreprises = res.result.data;
    this.entreprisesGrouped = this.entreprises.reduce((r,{type})=>{
      if(!r.some(o=>o.name==type.libelle)){
        r.push(
          {
            name:type.libelle,
          entreprises:this.entreprises.filter(v=>v.type.id==type.id)});
      }
      return r;
    },[]);
    this.cdr.markForCheck();
  }

  async getInterimaires(){
    var res = await this.authService.getAll({'categorie_code':'INTERIMAIRE', 'paginate':false}).toPromise();
    if(res){
      this.interimairesList = res.result.data;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.visiteForm && this.visiteForm.controls[controlName]){
      const control = this.visiteForm.controls[controlName]
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
		const control = this.visiteForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }

  
  formHasValue(key){
    return this.visiteForm.get(key).value ? true:false;
  }
  clearValue(key){
    this.visiteForm.get(key).patchValue(null);
  }
  
  isChecked(controlName: string){
    return this.visiteForm.get(controlName).value == '1';
  }

  updateToggleValue(event, controlName){
    if(event.checked){
      this.visiteForm.controls[controlName].setValue('1');
    }else{
      this.visiteForm.controls[controlName].setValue('0');
    }
  }

  entHasCode(){
    if(!this.entrepriseSelected){
      return false;
    }
    return this.entrepriseSelected.type.code
  }

  setDynamicEntreprise(){
    this.visiteForm.get('entreprise_id').valueChanges.subscribe(entreprise_id=>{
      if (entreprise_id!=null){
        var entrepriseSelected = this.entreprises.filter(x=> x.id == entreprise_id)[0];
        if(entrepriseSelected.type.code == 'INTERIM'){
          this.visiteForm.get('nom_prenom').setValue(null);
          this.visiteForm.get('nom_prenom').setValidators(null);
    
          this.visiteForm.get('interimaire_id').setValue(null);
          this.visiteForm.get('interimaire_id').setValidators(Validators.required);
          
          this.getInterimaires();

        }else{
          this.visiteForm.get('interimaire_id').setValue(null);
          this.visiteForm.get('interimaire_id').setValidators(null);
    
          this.visiteForm.get('nom_prenom').setValidators(Validators.required);
        }
        this.entrepriseSelected = entrepriseSelected;
      }else{
        this.entrepriseSelected = null;
        this.visiteForm.get('nom_prenom').setValue(null);
        this.visiteForm.get('nom_prenom').setValidators(null);
        this.visiteForm.get('interimaire_id').setValue(null);
        this.visiteForm.get('interimaire_id').setValidators(null);
      }

      this.visiteForm.get('nom_prenom').updateValueAndValidity();
      this.visiteForm.get('interimaire_id').updateValueAndValidity();
    })
  }
  
}
