import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Outillage } from '@app/core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { OutillageService } from '@app/core/services';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-search-outillage-form',
  templateUrl: './search-outillage-form.component.html',
  styleUrls: ['./search-outillage-form.component.scss']
})
export class SearchOutillageFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() parent: string;
  @Input() origin: string;
  
  private _data = new BehaviorSubject<Outillage>(null);
  @Input()
  set data(value) {
      this._data.next(value);
  };
  get data() {
      return this._data.getValue();
  }

  @Output() onDisplayOutillage: EventEmitter<any> = new EventEmitter<any>();

  searchControl: FormControl = new FormControl();
  
  public outillage : Outillage;
  public outillages : Array<Outillage>;
  filteredOutillages: Observable<Array<Outillage>>;


  constructor(
    private activatedRoute: ActivatedRoute,
    protected outillageService:OutillageService,
    private cdr: ChangeDetectorRef,
    private router:Router,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) { 
    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit() {
    this.initFilteredOutillages();

    switch(this.origin){
      case 'add':
        // if(this.form.get('outillage').value){
        //   this.outillage = this.form.get('outillage').value
        //   this.origin = 'edit';
        // }else if(this.form.get('outillage_id').value){
        //   this.getOutillage(this.form.get('outillage_id').value);
        //   this.activatedRoute.queryParams
        //   .subscribe(params => {
        //     if(params.outillage_id){
        //       this.searchControl.setValue({id:params.outillage_id});
        //       this.searchForOutillage();
        //     }
        //   });
        // }
        break;
      case 'edit':
        if(this.form.get('chantier').value){
          this.outillage = this.form.get('outillage').value
        }else if(this.form.get('outillage_id').value){
          this.getOutillage(this.form.get('outillage_id').value);
        }
        break;
      case 'detail':
        this._data.subscribe(x => {
          if(this.data)
          this.outillage = this.data;
        });
        break;
    }

  }

  ngAfterViewInit(){

  }

  async initFilteredOutillages(){
    var res = await this.outillageService.getAllMateriels().toPromise();
    this.outillages = res.result.data;
    this.filteredOutillages = this.searchControl.valueChanges.pipe(map(value => this._filter(value)));
  }

  private _filter(value: string): Array<Outillage> {
    const filterValue = value;
    return this.outillages.filter(outillage => 
      this._normalizeValue(outillage.libelle).includes(filterValue)
    );
  }

  private _normalizeValue(value: String): string {
    //console.log(value);
    return value.toLowerCase().replace(/\s/g, '');
  }

  searchForOutillage(){
    if(this.searchControl.value && this.searchControl.value.id){
      if(!this.searchControl.value.is_all_ars_archived && this.parent == "ar"){
        Swal.fire({
          icon: 'warning',
          title: 'Vous allez dupliquer cette Analyse de risque',
          html: '<p class="text-warning"><b>L\'analyse de risque en cours sur ce chantier sera archivée</b></p><p>Voulez-vous continuer ?</p>',
          showConfirmButton: true,
          showCancelButton: true,
          cancelButtonText: 'Annuler',
          confirmButtonText: 'Confirmer'
        }).then(async response => {
          if (response.value) {
            this.initFilteredOutillages();
            this.getOutillage(this.searchControl.value.id);
          }
        });
      }else{
        this.initFilteredOutillages();
        this.getOutillage(this.searchControl.value.id);
      }
    }
  }

  async getOutillage(outillageId: Number){
    try {
      var res = await this.outillageService.getMaterielById(outillageId).toPromise();
      this.outillage = res.result.data;
      this.onDisplayOutillage.emit(this.outillage);
      if(this.origin == 'add' || this.origin == 'edit'){
        this.form.controls.outillage_id.setValue(this.outillage.id);
      }
      this.cdr.detectChanges();
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  displayFn(outillage: Outillage): String {
    return outillage ? outillage.libelle : '';
  }


}