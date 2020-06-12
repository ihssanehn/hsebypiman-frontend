import { Component, OnInit, Input, ChangeDetectorRef, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Vehicule } from '@app/core/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'tf-add-vehicule-form',
  templateUrl: './add-vehicule-form.component.html',
  styleUrls: ['./add-vehicule-form.component.scss']
})
export class AddVehiculeFormComponent implements OnInit {

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

  addControl: FormControl = new FormControl();
  vehicule : Vehicule;

  constructor(
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) { 
    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  ngOnInit() {
    switch(this.origin){
      case 'add':
        if(this.form.get('vehicule').value){
          this.vehicule = this.form.get('vehicule').value;
          this.addControl.setValue(this.vehicule);
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

  addVehicule(){
    if(this.addControl.value){
      this.vehicule = this.addControl.value;
      this.onDisplayVehicule.emit(this.vehicule);
      if(this.origin == 'add'){
        this.form.controls.vehicule.setValue(this.vehicule);
      }
    }
  }

}
