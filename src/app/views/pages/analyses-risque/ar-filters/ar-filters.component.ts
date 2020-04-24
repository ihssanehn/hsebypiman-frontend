import { Component, OnInit, AfterViewInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Chantier, Status } from '@app/core/models';
import { User, AuthService } from '@app/core/auth';
import { EventEmitter } from '@angular/core';
import { StatusService, ChantierService } from '@app/core/services';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'tf-ar-filters',
  templateUrl: './ar-filters.component.html',
  styleUrls: ['./ar-filters.component.scss']
})
export class ArFiltersComponent implements OnInit, AfterViewInit {

  @Output() change = new EventEmitter();
  
  filterForm: FormGroup;
  clients: String[];
  chantiers: Chantier[];
  users: User[];
  status: Status[];
  observationsOptions = [
    'Avec',
    'Sans'
  ]

  constructor(
    private statusService: StatusService,
    private chantierService:ChantierService, 
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
    this.getClients();
    this.getChantiers();
    this.getUsers();
    this.getStatus();
    this.initFiltersForm();
    this.filterForm.valueChanges.subscribe(data => this.search(data));
  }
  
  ngAfterViewInit(){
  }

  async getClients(){
    var res = await this.chantierService.getAllClients().toPromise();
    this.clients = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getChantiers(){
    var res = await this.chantierService.getList().toPromise();
    this.chantiers = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getUsers(){
    var res = await this.authService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getStatus(){
    var res = await this.statusService.getAllFromModel('Ar').toPromise();
    this.status = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  initFiltersForm(){
    this.filterForm = this.fb.group({
      client:[null],
      chantier_id:[null],
      charge_affaire_id:[null],
      status_id:[null],
      signatories_id:[null],
      date_creation_start:[null],
      date_creation_end:[null],
      date_demarrage_start:[null],
      date_demarrage_end:[null],
      observation:[null],
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
