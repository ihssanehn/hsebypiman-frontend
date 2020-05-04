import { Component, OnInit, ChangeDetectorRef, Input, Sanitizer } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chantier } from '@app/core/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ChantierService } from '@app/core/services';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tf-search-chantier-form',
  templateUrl: './search-chantier-form.component.html',
  styleUrls: ['./search-chantier-form.component.scss']
})
export class SearchChantierFormComponent implements OnInit {

  @Input() arForm: FormGroup;
  @Input() origin: string;
  
  private _data = new BehaviorSubject<Chantier>(null);
  @Input()
  set data(value) {
      this._data.next(value);
  };

  get data() {
      return this._data.getValue();
  }

  searchControl: FormControl = new FormControl();
  
  public chantier : Chantier;
  public chantiers : Array<Chantier>;
  filteredChantiers: Observable<Array<Chantier>>;


  constructor(
    private activatedRoute: ActivatedRoute,
    protected chantierService:ChantierService,
    private cdr: ChangeDetectorRef,
    private router:Router,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) { 
    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit() {
    this.initFilteredChantiers();
    
    if(this.origin == 'edit'){
      this.getChantier(this.arForm.get('chantier_id').value);
    }else{
      if(this.origin == 'detail'){
        this._data
          .subscribe(x => {
            if(this.data)
            this.getChantier(this.data.id);
        });
      }else{
        if(this.origin == 'add'){
          if(this.arForm.get('chantier_id').value){
            this.getChantier(this.arForm.get('chantier_id').value);
          }
          this.activatedRoute.queryParams
          .subscribe(params => {
            if(params.chantier_id){
              this.searchControl.setValue({id:params.chantier_id});
              this.searchForChantier();
            }
          });
        }
      }
    }

  }

  ngAfterViewInit(){

  }

  async initFilteredChantiers(){
    var res = await this.chantierService.getList().toPromise();
    this.chantiers = res.result.data.filter(item => item.montant > 20000);
    this.filteredChantiers = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): Array<Chantier> {
    const filterValue = value;
    return this.chantiers.filter(chantier => 
      this._normalizeValue(chantier.nom).includes(filterValue)
    );
  }

  private _normalizeValue(value: String): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  searchForChantier(){
    if(this.searchControl.value && this.searchControl.value.id){
      this.initFilteredChantiers();
      this.getChantier(this.searchControl.value.id);
    }
  }

  async getChantier(chantierId: Number){
    try {
      var res = await this.chantierService.get(chantierId).toPromise();
      this.chantier = res.result.data;
      if(this.origin == 'add' || this.origin == 'edit'){
        this.arForm.controls.chantier_id.setValue(this.chantier.id);
      }
      this.cdr.detectChanges();
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  displayFn(chantier: Chantier): String {
    return chantier ? chantier.nom : '';
  }

  goToChantier(id){
    let url = this.router.url;
		url = `/chantiers/detail/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
}
