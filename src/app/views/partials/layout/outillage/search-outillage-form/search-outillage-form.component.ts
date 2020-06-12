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
  
  outillage:Outillage = null;
  
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

  constructor(
    protected outillageService:OutillageService,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) { 
    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit() {
   
  }


  onSubmit(value){
    this.onDisplayOutillage.emit(this.searchControl.value);
  }


 

  displayFn(outillage: Outillage): String {
    return outillage ? outillage.libelle : '';
  }


}