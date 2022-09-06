import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { Type } from '@app/core/models/type.model';
import { BuService, EntityService, EntrepriseService, FonctionService, RoleService, UserService } from '@app/core/services';
import { Role } from '@app/core/auth';
import { Entreprise } from '@app/core/models';

@Component({
  selector: 'tf-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Input() userForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  fonctions: Type[];
  entities: Type[];
  buList: Type[];
  profitCenters: any;
  clients: Entreprise[];
  roles: Role[];
  civilites = [
    'Mme', 'Mlle', 'M.'
  ]

  fonctionsLoaded: boolean = false;
  entitiesLoaded: boolean = false;
  buLoaded: boolean = false;
  profitCentersLoaded: boolean = false;
  clientsLoaded: boolean = false;

  rolesLoaded: boolean = false;



  constructor(
    private fonctionService: FonctionService,
    private entityService: EntityService,
    private buService: BuService,
    private cdr: ChangeDetectorRef,
    private roleService: RoleService,
    private userService: UserService,
    private entrepriseService: EntrepriseService

  ) { }

  ngOnInit() {
    this.getFonctions();
    this.getEntities();
    this.getBu();
    this.getProfitCenters();
    this.getClients();
    this.getRoles();
  }

  async getFonctions(){
    this.fonctionsLoaded = false;
    var res = await this.fonctionService.getList().toPromise();
    if(res){
      this.fonctions = res.result.data;
      this.fonctionsLoaded = true;
    }
    this.cdr.markForCheck();
  }

  async getEntities(){
    this.entitiesLoaded = false;
    var res = await this.entityService.getList().toPromise();
    if(res){
      this.entities = res.result.data;
      this.entitiesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  async getBu(){
    this.buLoaded = false;
    var res = await this.buService.getList().toPromise();
    if(res){
      this.buList = res.result.data;
      this.buLoaded = true;
    }
    this.cdr.markForCheck();
  }

  async getProfitCenters(){
    this.profitCentersLoaded = false;
    var res = await this.userService.getAll({'role': 'MANAGER' ,'paginate':false}).toPromise();
    if(res){
      this.profitCenters = res.result.data;
      this.profitCentersLoaded = true;
    }
    this.cdr.markForCheck();
  }

  async getClients(){
    this.clientsLoaded = false;
    var res = await this.entrepriseService.getList().toPromise();
    if(res){
      this.clients = res.result.data;
      this.clientsLoaded = true;
    }
    this.cdr.markForCheck();
  }
  

  async getRoles(){
    this.rolesLoaded = false;
    var res = await this.roleService.getList().toPromise();
    if(res){
      this.roles = res.result.data;
      this.rolesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.userForm && this.userForm.controls[controlName]){
      const control = this.userForm.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

  isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.userForm.controls[controlName];
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

  onAccessCheckChange(event){
    const is_blocked = this.userForm.get('is_blocked') as FormControl;
    if(event.checked){
      is_blocked.setValue(0);
    }else{
      is_blocked.setValue(1);
    }
  }

  onVirtuelCheckChange(event){
    const is_virtual = this.userForm.get('is_virtual') as FormControl;
    if(event.checked){
      is_virtual.setValue(1);
    }else{
      is_virtual.setValue(0);
    }
  }

  onInternalCheckChange(event){
    const is_internal = this.userForm.get('is_internal') as FormControl;
    if(event.checked){
      is_internal.setValue(1);
    }else{
      is_internal.setValue(0);
    }
  }

  isInternal() {
    return this.userForm.get('is_internal').value;
  }


}
