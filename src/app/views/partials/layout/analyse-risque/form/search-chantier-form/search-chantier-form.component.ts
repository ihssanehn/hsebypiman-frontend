import { Component, OnInit, ChangeDetectorRef, Input, Sanitizer } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chantier } from '@app/core/models';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ChantierService } from '@app/core/services';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

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
  }

  ngAfterViewInit(){
    if(this.edit){
      console.log(this.arForm);
      console.log(this.arForm.get('chantier_id').value);
      this.getChantier(this.arForm.get('chantier_id').value);
    }
  }

  async initFilteredChantiers(){
    this.chantiers = await this.chantierService.getAll().toPromise();
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
      this.chantier = await this.chantierService.get(chantierId).toPromise();
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
