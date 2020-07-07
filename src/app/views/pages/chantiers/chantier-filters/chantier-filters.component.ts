import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, Input, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { ChantierService, TypeService, StatusService, EntrepriseService, PersonnelService } from '@app/core/services';
import { Chantier, Type, Status, Entreprise } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import * as moment from 'moment';
import { debounceTime, map } from 'rxjs/operators';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';


@Component({
  selector: 'tf-chantier-filters',
  templateUrl: './chantier-filters.component.html',
  styleUrls: ['./chantier-filters.component.scss'],
})

export class ChantierFiltersComponent implements OnInit, AfterViewInit
{
  
  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  users: User[];
  status: Status[];
  types: Type[];
  clients: String[];
  entreprises: Entreprise[];
  visiteOptions = [
    'Avec',
    'Sans'
  ]
  analyseOptions = [
    'Avec',
    'Sans'
  ]
  entrepriseOptions = [
    'Avec',
    'Sans'
  ]
  statuses;

  @Output() change = new EventEmitter();
  constructor(
    private statusService: StatusService,
    private chantierService:ChantierService, 
    private entrepriseService:EntrepriseService, 
    private typeService:TypeService,
    private userService:PersonnelService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe:DateFrToEnPipe,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) {
		iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit(){
    this.getStatus();
    this.getUsers();
    this.getClients();
    this.getTypes();
    this.getEntreprises();
    this.initFiltersForm();
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
  }
  
  ngAfterViewInit(){


  }

  // Load ressources needed
  async getUsers(){
    var res = await this.userService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.markForCheck();
  }
  async getEntreprises(){
    var res = await this.entrepriseService.getList().toPromise();
    this.entreprises = res.result.data;
    this.cdr.markForCheck();
  }
  async getStatus(){
    var res = await this.statusService.getAllFromModel('Chantier').toPromise();
    this.status = res.result.data;
    // var status_termine = this.status.filter(x=>x.code == 'ENCOURS')[0].id;
    // this.filterForm.patchValue({'status_id':status_termine}, {onlySelf: true, emitEvent: true});
    this.cdr.markForCheck();
  }
  async getClients(){
    var res = await this.chantierService.getAllClients().toPromise();
    this.clients = res.result.data;
    this.cdr.markForCheck();
  }
  async getTypes(){
    var res = await this.typeService.getAllFromModel('Chantier').toPromise();
    this.types = res.result.data;
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      chantier_nom:[null],
      charge_affaire_id:[null],
      resp_chiffrage_id:[null],
      status_id:[null],
      type_id:[null],
      client:[null],
      montant_min:[null],
      montant_max:[null],
      date_demarrage_start:[null],
      date_demarrage_end:[null],
      visite:[null],
      analyse:[null],
      has_entreprise:[null],
      entreprise_id:[null],
    })
  }
 
  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    filter.date_demarrage_start = this.dateFrToEnPipe.transform(filter.date_demarrage_start);
    filter.date_demarrage_end = this.dateFrToEnPipe.transform(filter.date_demarrage_end);
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }
  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }

}
