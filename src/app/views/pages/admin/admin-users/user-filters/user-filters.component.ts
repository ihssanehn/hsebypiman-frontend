import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, Input, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { TypeService, CategorieService, RoleService } from '@app/core/services';
import { Type, Categorie } from '@app/core/models';
import { AuthService, User, Role } from '@app/core/auth';
import moment from 'moment';
import { debounceTime, map } from 'rxjs/operators';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';


@Component({
  selector: 'tf-user-filters',
  templateUrl: './user-filters.component.html',
  styleUrls: ['./user-filters.component.scss'],
})

export class UserFiltersComponent implements OnInit, AfterViewInit
{
  
  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  users: User[];
  types: Type[];
  roles: Role[];
  categories: Categorie[];
  virtuelOptions = [
    {
      libelle: 'Profils virtuels uniquement',
      code:'YES'
    },
    {
      libelle: 'Profils non virtuels uniquement',
      code:'NO',
    }
  ]
  statuses;

  @Output() change = new EventEmitter();
  constructor(
    private typeService:TypeService,
    private categorieService:CategorieService,
    private roleService:RoleService,
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
    this.getTypes();
    this.getCategories();
    this.getRoles();
    this.initFiltersForm();
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
  }
  
  ngAfterViewInit(){


  }

  // Load ressources needed
  
  async getTypes(){
    var res = await this.typeService.getAllFromModel('User').toPromise();
    this.types = res.result.data;
    this.cdr.markForCheck();
  }
  async getCategories(){
    var res = await this.categorieService.getAllFromModel('Contrat').toPromise();
    this.categories = res.result.data;
    this.cdr.markForCheck();
  }
  async getRoles(){
    var res = await this.roleService.getList().toPromise();
    this.roles = res.result.data;
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      fonction:[null],
      contrat:[null],
      role:[null],
      is_virtual:[''],
      date_entree_start:[null],
      date_entree_end:[null],
      date_sortie_start:[null],
      date_sortie_end:[null],
    })
  }
 
  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    filter.date_entree_start = this.dateFrToEnPipe.transform(filter.date_entree_start);
    filter.date_entree_end = this.dateFrToEnPipe.transform(filter.date_entree_end);
    filter.date_sortie_start = this.dateFrToEnPipe.transform(filter.date_sortie_start);
    filter.date_sortie_end = this.dateFrToEnPipe.transform(filter.date_sortie_end);
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }
  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }

}
