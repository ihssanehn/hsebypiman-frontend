import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output, Input, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MaterielService, CategorieService, StatusService } from '@app/core/services';
import { Materiel, Categorie, Status } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import * as moment from 'moment';
import { debounceTime, map } from 'rxjs/operators';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';


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
    this.getCategories();
    this.initFiltersForm();
    this.filterForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => this.search(data));
  }
  
  ngAfterViewInit(){
  }

  
  async getCategories(){
    var res = await this.categorieService.getAll({model:'Materiel', structure:'tree'}).toPromise();
    this.categories = res.result.data;
    this.cdr.markForCheck();
  }
  
  initFiltersForm(){
    this.filterForm = this.fb.group({
      categorie_id:[null],
    })
  }
 
  search(filters: any): void {
    var filter = {...this.filterForm.getRawValue()}
    this.change.emit(filter);
  }

  formHasValue(key){
    return this.filterForm.get(key).value ? true:false;
  }

  clearValue(key){
    this.filterForm.get(key).patchValue(null);
  }

}
