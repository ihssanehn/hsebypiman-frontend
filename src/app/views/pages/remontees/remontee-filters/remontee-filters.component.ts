import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { TypeService, PersonnelService } from '@app/core/services';
import { Type } from '@app/core/models';
import { User } from '@app/core/auth';
import { debounceTime, } from 'rxjs/operators';
import { DateFrToEnPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-remontee-filters',
  templateUrl: './remontee-filters.component.html',
  styleUrls: ['./remontee-filters.component.scss'],
})

export class RemonteeFiltersComponent implements OnInit, AfterViewInit
{
  
  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  users: User[];
  types: Type[];
  publication_states = [
    {
      libelle: "En attente d'approbation",
      value: 0
    },
    {
      libelle: "Publiée",
      value: 1
    }
  ]

  @Output() change = new EventEmitter();
  constructor(
    private typeService:TypeService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userService:PersonnelService,
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
  async getTypes(){
    var res = await this.typeService.getAllFromModel('Remontee').toPromise();
    this.types = res.result.data;
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      type_id:[null],
      creator_id:[null],
      publication_state:[null],
      date_creation_start:[null],
      date_creation_end:[null],
    })
  }
 
  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    filter.date_creation_start = this.dateFrToEnPipe.transform(filter.date_creation_start);
    filter.date_creation_end = this.dateFrToEnPipe.transform(filter.date_creation_end);
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }

  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }

}
