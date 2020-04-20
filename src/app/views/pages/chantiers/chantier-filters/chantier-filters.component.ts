import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, Input, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent, of, Subscription } from 'rxjs';
import { debounceTime,map,distinctUntilChanged,filter, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { ChantierService, TypeService, StatusService } from '@app/core/services';
import { Chantier, Type, Status } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';


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
  visiteOptions = [
    'Avec',
    'Sans'
  ]
  statuses;

  @Output() change = new EventEmitter();
  constructor(
    private statusService: StatusService,
    private chantierService:ChantierService, 
    private typeService:TypeService,
    private authService:AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
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
    this.initFiltersForm();
    this.filterForm.valueChanges.subscribe(data => this.search(data));
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
  async getStatus(){
    var res = await this.statusService.getAllFromModel('Chantier').toPromise();
    this.status = res.result.data;
    var status_termine = this.status.filter(x=>x.code == 'ENCOURS')[0].id;
    this.filterForm.patchValue({'status_id':status_termine}, {onlySelf: true, emitEvent: false});
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getClients(){
    var res = await this.chantierService.getAllClients().toPromise();
    this.clients = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getTypes(){
    var res = await this.typeService.getAllFromModel('Chantier').toPromise();
    this.types = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      charge_affaire_id:[null],
      status_id:[null],
      type_id:[null],
      client:[null],
      montant_min:[null],
      montant_max:[null],
      date_demarrage_start:[null],
      date_demarrage_end:[null],
      visite:[null],
    })
  }
 
  search(filters: any): void {
    this.change.emit(filters);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }
  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }
}
