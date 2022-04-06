import { Component, OnInit, OnChanges, ChangeDetectorRef, Input, Sanitizer, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chantier } from '@app/core/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ChantierService } from '@app/core/services';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'tf-search-chantier-form',
  templateUrl: './search-chantier-form.component.html',
  styleUrls: ['./search-chantier-form.component.scss']
})
export class SearchChantierFormComponent implements OnChanges {

  @Input() form: FormGroup;
  @Input() parent: string;
  @Input() origin: string;
  
  private _data = new BehaviorSubject<Chantier>(null);
  @Input()
  set data(value) {
      this._data.next(value);
  };
  get data() {
      return this._data.getValue();
  }

  @Output() onDisplayChantier: EventEmitter<Chantier> = new EventEmitter<Chantier>();

  searchControl: FormControl = new FormControl();
  
  public chantier : Chantier;
  public chantiers : Array<Chantier>;
  filteredChantiers: Observable<Array<Chantier>>;


  constructor(
    private activatedRoute: ActivatedRoute,
    protected chantierService:ChantierService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private router:Router,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) { 
    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }


  ngOnInit(){
    this.initFilteredChantiers();
  }
  ngOnChanges() {
    switch(this.origin){
      case 'add':
        if(this.form.get('chantier').value){
          this.chantier = this.form.get('chantier').value
          this.origin = 'edit';
          console.log(this.chantier);
        }else if(this.form.get('chantier_id').value){
          this.getChantier(this.form.get('chantier_id').value);
          this.activatedRoute.queryParams
          .subscribe(params => {
            if(params.chantier_id){
              console.log('pas de chantier');
              this.searchControl.setValue({id:params.chantier_id});
              this.searchForChantier();
            }
          });
        }
        break;
      case 'edit':
        if(this.form.get('chantier').value){
          this.chantier = this.form.get('chantier').value
        }else if(this.form.get('chantier_id').value){
          this.getChantier(this.form.get('chantier_id').value);
        }
        break;
      case 'detail':
        this._data.subscribe(x => {
          if(this.data)
          this.chantier = this.data;
        });
        break;
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
      if(!this.searchControl.value.is_all_ars_archived && this.parent == "ar"){
        Swal.fire({
          icon: 'warning',
          title: this.translate.instant('ARS.HEAD.NOTIF.AR_ARCHIVED.TITLE'),
          html: "<p class='text-warning'><b>"+this.translate.instant('ARS.HEAD.NOTIF.AR_ARCHIVED.LABEL')+"</b></p><p>"+this.translate.instant('ARS.HEAD.NOTIF.AR_ARCHIVED.SUBLABEL')+"</p>",
          showConfirmButton: true,
          showCancelButton: true,
          cancelButtonText: this.translate.instant("ACTION.CANCEL"),
          confirmButtonText: this.translate.instant("ACTION.CONFIRM")
        }).then(async response => {
          if (response.value) {
            this.initFilteredChantiers();
            this.getChantier(this.searchControl.value.id);
          }
        });
      }else{
        this.initFilteredChantiers();
        this.getChantier(this.searchControl.value.id);
      }
    }
  }

  async getChantier(chantierId: Number){
    try {
      var res = await this.chantierService.get(chantierId).toPromise();
      this.chantier = res.result.data;
      this.onDisplayChantier.emit(this.chantier);
      if(this.origin == 'add' || this.origin == 'edit'){
        this.form.controls.chantier_id.setValue(this.chantier.id);
      }
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
