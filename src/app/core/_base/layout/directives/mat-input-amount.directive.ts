import {Directive, ElementRef, HostListener, Input, Optional, Self} from '@angular/core';
import {MAT_INPUT_VALUE_ACCESSOR} from '@angular/material';
import { ControlValueAccessor, NgControl} from '@angular/forms';

@Directive({
  selector: 'input[matInputAmount]',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatInputAmountDirective},
    // {
    //   provide: NG_VALUE_ACCESSOR,
    //   useExisting: forwardRef(() => MatInputAmountDirective),
    //   multi: true,
    // }
  ]
})
export class MatInputAmountDirective implements ControlValueAccessor{
  // tslint:disable-next-line:variable-name
  private _value: string | null;
  @Input()
    get value(): string | null {
      return this._value;
    }
    set value(value: string | null) {
      this._value = value;
      this.formatValue(value);
    }

  constructor(private elementRef: ElementRef<HTMLInputElement>,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    console.log('created directive');
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
    
  }
  
  private numberToAmount(value){
    var parsed = '';
    var str = value+'';
    var dec = str.split('.')[1];
    var full = str.split('.')[0];
    var fullLength = full.length;
    console.log(fullLength%3);
    for(var i=0; i< fullLength/3; i++){
      
      if(i==0){
        parsed += full.substr(i, fullLength%3)+' ';
      }else if(i < fullLength/3 -1){
        parsed += full.substr( (i-1)*3 + fullLength%3 ,3) + ' ';
      }else{
        parsed += full.substr( (i-1)*3 + fullLength%3 ,3);
      }
    }
    if(dec){
      parsed += ','+dec;
    }

    return parsed
  }

  private formatValue(value: string | null) {
    if (value !== null) {
      this.elementRef.nativeElement.value = this.numberToAmount(value);
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }

  private unFormatValue() {
    const value = this.elementRef.nativeElement.value;
    this._value = value.replace(/[^\d.-]/g, '');
    if (value) {
      this.elementRef.nativeElement.value = this._value;
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value) {
    this._value = value.replace(/[^\d.-]/g, '');
    this._onChange(this._value); // here to notify Angular Validators
  }

  @HostListener('blur')
  _onBlur() {
    this.formatValue(this._value);
  }

  @HostListener('focus')
  onFocus() {
    this.unFormatValue();
  }

  _onChange(value: any): void {
  }

  writeValue(value: any) {
    this._value = value;
    this.formatValue(this._value); // format Value
  }

  registerOnChange(fn: (value: any) => void) {
    this._onChange = fn;
  }

  registerOnTouched() {
  }

}