import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Type, Status, CatHabilitation, Entreprise, VisiteChantier, VisiteEpi, VisiteOutillage, VisiteVehicule, Visite } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { 
  TypeService, 
  StatusService, 
  CatHabilitationService, 
  EntrepriseService, 
  UserService, 
  VisiteChantierService,
  VisiteEpiService,
  VisiteOutillageService,
  VisiteVehiculeService
} from '@app/core/services';
import { first, startWith, map } from 'rxjs/operators';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { Observable } from 'rxjs';


@Component({
  selector: 'tf-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.scss']
})
export class ActionFormComponent implements OnInit {

  @Input() actionForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Input() formloading: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  typesList: Type[];
  typeSelected: Type;
  typesLoaded: boolean = false;

  visiteTypesList = [
    { key: 'VsChantier',  value: 'Visite Chantier'},
    { key: 'VsEpi',       value: 'Visite EPI'},
    { key: 'VsOutillage', value: 'Visite Outillage'},
    { key: 'VsVehicule',  value: 'Visite Véhicule'}
  ];
  visiteTypesSelected: String;
  visiteTypesLoaded: boolean = false;

  usersList: User[];
  usersLoaded: boolean = false;
  statusList: Status[];
  statusLoaded: boolean = false;

  public visitesList : Array<Visite>;
  visitesLoaded: boolean = false;
  filteredVisites: Observable<Array<Visite>>;


  constructor(
    private typeService:TypeService,
    private statusService:StatusService,
    private userService:UserService,
    private visiteChantierService:VisiteChantierService,
    private visiteEpiService:VisiteEpiService,
    private visiteOutillageService:VisiteOutillageService,
    private visiteVehiculeService:VisiteVehiculeService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTypes();
    this.getUsers();
    this.getStatus();
    this.setDynamicActionType();
    this.setDynamicVisiteType();
    this.initFilteredVisites();
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

  async getVisitesChantier(){
    this.visitesLoaded = false;
    var res = await this.visiteChantierService.getList().toPromise();
    if(res){
      this.visitesList = res.result.data;
      this.visitesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  async getVisitesEpi(){
    this.visitesLoaded = false;
    var res = await this.visiteEpiService.getList().toPromise();
    if(res){
      this.visitesList = res.result.data;
      this.visitesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  async getVisitesOutillage(){
    this.visitesLoaded = false;
    var res = await this.visiteOutillageService.getList().toPromise();
    if(res){
      this.visitesList = res.result.data;
      this.visitesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  async getVisitesVehicule(){
    this.visitesLoaded = false;
    var res = await this.visiteVehiculeService.getList().toPromise();
    if(res){
      this.visitesList = res.result.data;
      this.visitesLoaded = true;
    }
    this.cdr.markForCheck();
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

  selectedTypeHasCode(){
    if(!this.typesLoaded || !this.typeSelected){
      return false;
    }
    return this.typeSelected.code
  }

  setDynamicActionType(){
    this.actionForm.get('type_id').valueChanges.subscribe(type_id => {
      this.actionForm.get('visite_type').setValue(null);
      if (type_id != null){
        var typeSelected = this.typesList.filter(x=> x.id == type_id)[0];
        if(typeSelected.code == 'VISITE_SECURITE'){
          this.actionForm.get('visite_type').setValidators(Validators.required);
        }else{
          this.actionForm.get('visite_type').setValidators(null);
        }
        this.typeSelected = typeSelected;
      }else{
        this.typeSelected = null;
        this.actionForm.get('visite_type').setValidators(null);
      }

      this.actionForm.get('visite_type').updateValueAndValidity();
    })
  }

  setDynamicVisiteType(){
    this.actionForm.get('visite_type').valueChanges.subscribe(visite_type => {
      this.actionForm.get('visite').setValue(null);
      if (visite_type != null){
        this.actionForm.get('visite').setValidators(Validators.required);
        var visiteTypesSelected = visite_type;

        this.visitesList = null;
        switch(visiteTypesSelected.key){
          case 'VsChantier':
            this.getVisitesChantier();
            break;
          case 'VsEpi':
            this.getVisitesEpi();
            break;
          case 'VsOutillage':
            this.getVisitesOutillage();
            break;
          case 'VsVehicule':
            this.getVisitesVehicule();
            break;
        }

        this.visiteTypesSelected = visiteTypesSelected;
      }else{
        this.visiteTypesSelected = null;
        this.actionForm.get('visite').setValidators(null);
      }

      this.actionForm.get('visite').updateValueAndValidity();
    })
  }

  async initFilteredVisites(){
    this.filteredVisites = this.actionForm.get('visite').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): Array<Visite> {
    const filterValue = value;
    return this.visitesList.filter(visite => 
      this._normalizeValue(visite.code).includes(filterValue)
    );
  }

  private _normalizeValue(value: String): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  displayFn(visite: Visite): String {
    return visite ? visite.code : '';
  }

}
