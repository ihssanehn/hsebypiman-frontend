import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectOptionModel } from '@app/core/_base/layout';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'tf-select-autocomplete',
  templateUrl: './select-autocomplete.component.html',
  styleUrls: ['./select-autocomplete.component.scss']
})
export class SelectAutocompleteComponent implements OnInit {

  @Input() label: string;
  @Input() control: FormControl = new FormControl('');
  @Input() options: SelectOptionModel[] = [];
  @Input() validationType: string = 'required';
  @Input() class: string = '';
  @Input() allowClear: boolean = true;

  filteredOptions: Observable<SelectOptionModel[]>;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.initOptions();
  }

  ngOnInit(): void {
    this.initOptions();
  }

  initOptions() {
    if(this.options.length) {
      this.filteredOptions = this.control.valueChanges.pipe(
        startWith(''),
        map(value => {
          if(value){
            const name = typeof value === 'string' ? value : value.name;
            return name ? this.filter(name as string) : this.options.slice();
          }
          else{
            return this.options.slice()
          }
        })
      );
    } else {
      this.filteredOptions = new Observable<SelectOptionModel[]>();
    }
  }

  displayFn(id: number): string {
    if(id && this.options.length) {
      return this.options.find(option => option.id === id).name;
    } else return '';
  }


  filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  formHasValue(){
    if(this.control){
      return this.control.value ? true : false;
    }
  }
  
  clearValue(){
    this.control.setValue(null);
  }

  isControlHasError(): boolean {
		if (!this.control) {
			return false;
		}

		const result = this.control.hasError(this.validationType) && (this.control.dirty || this.control.touched);
		return result;
  }

  isFieldRequired(){
    if(this.control){
      const { validator } = this.control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

}
