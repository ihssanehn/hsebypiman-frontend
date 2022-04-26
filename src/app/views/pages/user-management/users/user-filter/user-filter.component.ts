import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AuthService } from '@app/core/auth';

@Component({
    selector: 'tf-user-filter',
    templateUrl: './user-filter.component.html',
    styleUrls: ['./user-filter.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => UserFilterComponent),
        multi: true
    }]
})
export class UserFilterComponent implements ControlValueAccessor {

    constructor(private authService : AuthService) { }
    hidden = false;
  
    filter = {
        keyword : "",
        role_ids : [],
    };

    @Output() change = new EventEmitter();

    
    ngOnInit() {
    }



    submit(){
        this.change.emit(this.filter);
    }

    onChange: (_: any) => void = (_: any) => { };


    onTouched: () => void = () => { };




    writeValue(value): void {
        if(value){
            this.filter = value;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }


    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    get value(): any {
        return this.filter;
    }

}
