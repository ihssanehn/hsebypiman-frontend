import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { SelectOptionModel } from '@app/core/_base/layout';

@Component({
  selector: 'tf-multi-select-autocomplete',
  templateUrl: './multi-select-autocomplete.component.html',
  styleUrls: ['./multi-select-autocomplete.component.scss']
})
export class MultiSelectAutocompleteComponent implements OnInit {

  @Input() class: string = '';
  @Input() label: string;
  @Input() control: FormControl = new FormControl([]);
  @Input() options: SelectOptionModel[] = [];
  @Input() validationType: string = 'required';

  filteredOptions: Observable<SelectOptionModel[]>;
  selectedOptions: SelectOptionModel[] = [];
  search: FormControl = new FormControl('');

  visible = true;
  selectable = true;
  isSearching: boolean = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('input', {static: false}) input: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger, {static: false}) autoTrigger: MatAutocompleteTrigger;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.initOptions();
    this.initSelectedOptions();
  }

  ngOnInit(): void {
    this.initOptions();
  }

  initOptions(): void {
      this.filteredOptions = this.search.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => {
          if(value){
            const name = typeof value === 'string' ? value : value.name;
            return name ? this.filter(name as string) : this.filterSelectedOption().slice();
          }else{
            return this.filterSelectedOption().slice();
          }
        })
      );
  }
  
  initSelectedOptions() {
    if(this.options.length && this.control.value.length) {
      this.selectedOptions = this.options.filter(option => this.control.value.includes(option.id))
    }
  }

  remove(selected: SelectOptionModel): void {
    const index = this.selectedOptions.findIndex(option => option.id == selected.id);
    this.search.updateValueAndValidity();
    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
      this.refreshControl();
    }
  }

  selected(event): void {
    var selected = event.option.value;
    this.selectedOptions.push(selected);
    this.input.nativeElement.value = '';
    this.search.setValue('');
    this.search.updateValueAndValidity();
    this.input.nativeElement.focus()
    requestAnimationFrame(()=>this.autoTrigger.openPanel())
    this.refreshControl();
  }

  refreshControl() {
    let ids = this.selectedOptions.map(option => option.id);
    this.control.setValue(ids);
  }

  filter(name: string): SelectOptionModel[] {
    const filterValue = name.toLowerCase();
    const ids = this.selectedOptions.map(option => option.id);
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue) && !ids.includes(option.id));
  }

  filterSelectedOption(): SelectOptionModel[] {
    const ids = this.selectedOptions.length ? this.selectedOptions.map(option => option.id) : [];
    return this.options.filter(option => !ids.includes(option.id));
  }

}
