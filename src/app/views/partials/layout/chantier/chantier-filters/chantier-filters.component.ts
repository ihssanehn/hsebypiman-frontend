import { ChangeDetectorRef, Component, OnInit, AfterViewInit, EventEmitter, Output, OnDestroy, forwardRef, ViewChild, ElementRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { fromEvent, of, Subscription } from 'rxjs';
import { debounceTime,map,distinctUntilChanged,filter, tap } from 'rxjs/operators';
// import { Status } from '@app/core/_base/layout/models/status.model';
// import { StatusService } from '@app/core/_base/layout/services/status.service';
@Component({
  selector: 'tf-chantier-filters',
  templateUrl: './chantier-filters.component.html',
  styleUrls: ['./chantier-filters.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChantierFiltersComponent),
    multi: true
  }]
})
export class ChantierFiltersComponent implements AfterViewInit, OnInit, OnDestroy {

  
  @ViewChild('searchInput', {static: false}) searchInput: ElementRef;

  loading = false;
  hidden = true;
  data;
  filter = {
    keyword: "",
    dateRange: [],
    status_id: ""
  };
  statuses;

	// Private properties
  private readonly subscriptions: Subscription[] = [];
  
  @Output() change = new EventEmitter();
  constructor(
    // private statusService: StatusService
  ) {}

  async ngOnInit(){}

  async ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement,'keyup')
      .pipe(
          filter(Boolean),
          debounceTime(300),
          distinctUntilChanged(),
      )
      .subscribe((text:string)=>{
        this.filter.keyword = this.searchInput.nativeElement.value;
        this.submit();
      });
  }

  submit() {
    this.change.emit(this.filter);
  }

  submitDebounce(){
    setTimeout(() => {
      this.submit();
    }, 3000);
  }

  onChange: (_: any) => void = (_: any) => { };


  onTouched: () => void = () => { };


  writeValue(value): void {
    if (value) {
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
  
  /**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  
  clear(){
    this.searchInput.nativeElement.value = '';
    this.filter.keyword = null;
    this.submit();
  }
  
}
