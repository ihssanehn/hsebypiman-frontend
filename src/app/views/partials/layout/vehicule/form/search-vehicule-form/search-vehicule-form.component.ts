import { Component, OnInit, Input, ChangeDetectorRef, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Vehicule } from '@app/core/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { VehiculeService } from '@app/core/services';
import { startWith, map } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'tf-search-vehicule-form',
  templateUrl: './search-vehicule-form.component.html',
  styleUrls: ['./search-vehicule-form.component.scss']
})
export class SearchVehiculeFormComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() parent: string;
  @Input() origin: string;

  private _data = new BehaviorSubject<Vehicule>(null);
  @Input()
  set data(value) {
      this._data.next(value);
  };
  get data() {
      return this._data.getValue();
  }

  @Output() onDisplayVehicule: EventEmitter<Vehicule> = new EventEmitter<Vehicule>();

  searchControl: FormControl = new FormControl();
  
  vehicule : Vehicule;
  vehicules : Array<Vehicule>;
  filteredVehicules: Observable<Array<Vehicule>>;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected vehiculeService: VehiculeService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) { 
    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit() {
    this.initFilteredVehicule();

    switch(this.origin){
      case 'add':
        if(this.form.get('vehicule').value){
          this.vehicule = this.form.get('vehicule').value
          this.origin = 'edit';
        }else if(this.form.get('vehicule_id').value){
          this.getVehicule(this.form.get('vehicule_id').value);
          this.activatedRoute.queryParams
          .subscribe(params => {
            if(params.vehicule_id){
              this.searchControl.setValue({id:params.vehicule_id});
              this.searchForVehicule();
            }
          });
        }
        break;
      case 'edit':
        if(this.form.get('vehicule').value){
          this.vehicule = this.form.get('vehicule').value
        }else if(this.form.get('vehicule_id').value){
          this.getVehicule(this.form.get('vehicule_id').value);
        }
        break;
      case 'detail':
        this._data.subscribe(x => {
          if(this.data)
          this.vehicule = this.data;
        });
        break;
    }
  }

  async initFilteredVehicule(){
    var res = await this.vehiculeService.getList().toPromise();
    this.vehicules = res.result.data;
    this.filteredVehicules = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): Array<Vehicule> {
    const filterValue = value;
    return this.vehicules.filter(vehicule => 
      this._normalizeValue(vehicule.libelle).includes(filterValue)
    );
  }

  private _normalizeValue(value: String): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  searchForVehicule(){
    if(this.searchControl.value && this.searchControl.value.id){
      this.initFilteredVehicule();
      this.getVehicule(this.searchControl.value.id);
    }
  }

  async getVehicule(vehiculeId: Number){
    try {
      var res = await this.vehiculeService.get(vehiculeId).toPromise();
      this.vehicule = res.result.data;
      this.onDisplayVehicule.emit(this.vehicule);
      if(this.origin == 'add' || this.origin == 'edit'){
        this.form.controls.vehicule_id.setValue(this.vehicule.id);
      }
      this.cdr.detectChanges();
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  displayFn(vehicule: Vehicule): String {
    return vehicule ? vehicule.libelle : '';
  }

}
