import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { CategorieService, PersonnelService } from '@app/core/services';
import { Categorie } from '@app/core/models';
import { User, AuthService } from '@app/core/auth';
import { debounceTime } from 'rxjs/operators';
import { DateFrToEnPipe, RecursiveSearchPipe } from '@app/core/_base/layout';


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
  categories: Categorie[];


  @Output() change = new EventEmitter();
  constructor(
    private categorieService:CategorieService,
    private userService:PersonnelService,
    private fb: FormBuilder,
    private authService: AuthService,
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

  categorieChanged(data){
    if(data != this.filterForm.get('categorie_id')){
      this.filterForm.get('categorie_id').setValue(data);
    }
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
      categorie_id:[null],
      actual_user_id:[null],
      date_entree_start:[null],
      date_entree_end:[null],
      late_check:[null],
      only_atex:[null],
      only_available:[null]
    })

    if(['MANAGER', 'USER'].includes(this.authService.currentUserValue.role.code)){
      this.filterForm.get('actual_user_id').disable();
      this.filterForm.get('actual_user_id').setValue(this.authService.currentUserValue.id);
    }
  }
 
  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    filter.date_entree_start = this.dateFrToEnPipe.transform(filter.date_entree_start);
    filter.date_entree_end = this.dateFrToEnPipe.transform(filter.date_entree_end);
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

  onCheckChange(event, target){
    var _value = event.checked ? 1 : 0;
    this.filterForm.get(target).setValue(_value)
  }
  toggleCheck(target){
    var _value = (!this.filterForm.get(target).value || this.filterForm.get(target).value == 0) ? 1 : 0;
    console.log(_value);
    this.filterForm.get(target).setValue(_value)
  }
}
