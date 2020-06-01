import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, Input, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { ChantierService, TypeService, StatusService, EntrepriseService } from '@app/core/services';
import { Chantier, Type, Status, Entreprise } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import * as moment from 'moment';
import { debounceTime, map } from 'rxjs/operators';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';


@Component({
  selector: 'tf-visite-chantier-filters',
  templateUrl: './visite-chantier-filters.component.html',
  styleUrls: ['./visite-chantier-filters.component.scss'],
})

export class VisiteChantierFiltersComponent implements OnInit, AfterViewInit
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
    private authService:AuthService,
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
    this.getUsers();
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
    var res = await this.authService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getEntreprises(){
    var res = await this.entrepriseService.getList().toPromise();
    this.entreprises = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getTypes(){
    var res = await this.typeService.getAllFromModel('Vs').toPromise();
    this.types = res.result.data.filter(x=>{return x.code == 'C' || x.code == 'SAV'});
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      chantier_nom:[null],
      redacteur_id:[null],
      visited_id:[null],
      personnel_id:[null],
      // status_id:[null],
      type_id:[null],
      date_visite_start:[null],
      date_visite_end:[null],
      entreprise_id:[null],
    })
  }
 
  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    filter.date_visite_start = this.dateFrToEnPipe.transform(filter.date_visite_start);
    filter.date_visite_end = this.dateFrToEnPipe.transform(filter.date_visite_end);
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }
  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }

}
