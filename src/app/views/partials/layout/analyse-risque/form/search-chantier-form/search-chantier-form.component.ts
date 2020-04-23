import { Component, OnInit, ChangeDetectorRef, Input, Sanitizer } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chantier } from '@app/core/models';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ChantierService } from '@app/core/services';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tf-search-chantier-form',
  templateUrl: './search-chantier-form.component.html',
  styleUrls: ['./search-chantier-form.component.scss']
})
export class SearchChantierFormComponent implements OnInit {

  @Input() arForm: FormGroup;
  @Input() edit: Boolean;

  searchControl: FormControl = new FormControl();
  
  public chantier : Chantier;
  public chantiers : Array<Chantier>;
  filteredChantiers: Observable<Array<Chantier>>;


  constructor(
    private activatedRoute: ActivatedRoute,
    protected chantierService:ChantierService,
    private cdr: ChangeDetectorRef,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) { 
    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit() {
    this.initFilteredChantiers();
    if(this.edit){
      this.getChantier(this.arForm.get('chantier_id').value);
    }
  }

  ngAfterViewInit(){

  }

  async initFilteredChantiers(){
    var res = await this.chantierService.getList().toPromise();
    this.chantiers = res.result.data;
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
      this.arForm.controls.chantier_id.setValue(this.chantier.id);
      this.cdr.detectChanges();
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  displayFn(chantier: Chantier): String {
    return chantier ? chantier.nom : '';
  }

}
