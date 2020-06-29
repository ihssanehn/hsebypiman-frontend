import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, Input, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MaterielService, CategorieService, StatusService,UserService } from '@app/core/services';
import { Materiel, Categorie, Status } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import * as moment from 'moment';
import { debounceTime, map } from 'rxjs/operators';
import { DateEnToFrPipe, DateFrToEnPipe, RecursiveSearchPipe } from '@app/core/_base/layout';


@Component({
  selector: 'tf-materiel-filters',
  templateUrl: './materiel-filters.component.html',
  styleUrls: ['./materiel-filters.component.scss'],
})

export class MaterielFiltersComponent implements OnInit, AfterViewInit
{
  
  filterForm: FormGroup;
  loading = false;
  hidden = true;
  data: boolean = false;
  users: User[];
  status: Status[];
  categories: Categorie[];
  clients: String[];
  visiteOptions = [
    'Avec',
    'Sans'
  ]
  analyseOptions = [
    'Avec',
    'Sans'
  ]
  materielOptions = [
    'Avec',
    'Sans'
  ]
  statuses;

  @Output() change = new EventEmitter();
  constructor(
    private statusService: StatusService,
    private materielService:MaterielService, 
    private categorieService:CategorieService,
    private authService:AuthService,
    private userService:UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe:DateFrToEnPipe,
    private recursiveSearchPipe:RecursiveSearchPipe,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) {
		iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit(){
    this.initFiltersForm();
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
    this.getCategories();
    this.getUsers();
    
  }
  
  ngAfterViewInit(){
  }

  // Load ressources needed
  async getUsers(){
    var res = await this.userService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.markForCheck();
  }

  async getCategories(){
    var res = await this.categorieService.getAll({model:'Materiel', structure:'tree'}).toPromise();
    this.categories = res.result.data;
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      categorie_ids:this.fb.array([null, null, null]),
      actual_user_id:[null],
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
  formHasIndexValue(key, index){
    return this.filterForm.get(key).value[index] ? true:false;
  }

  clearTreeValue(key, index){
    var array = this.filterForm.get(key) as FormArray;
    for(var i = index; i < array.value.length ; i++){
      array.at(i).patchValue(null);
    }
  }

  getSelectedCat(index){
    if(!this.categorie_ids.at(index).value){
      return null;
    }
    var items = this.recursiveSearchPipe.transform(this.categories, this.categorie_ids.at(index).value, 'id', 'children');
    if(items && items.length > 0){
      return items[0];
    };
  }

  getControlCategorieIndex(index){
    const categories = this.filterForm.get('categorie_ids') as FormArray;
    return categories.at(index) as FormControl;
  }

  get categorie_ids(): FormArray{
    return this.filterForm.get('categorie_ids') as FormArray;
  }
}
