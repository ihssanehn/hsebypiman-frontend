import { ChangeDetectorRef, Component, OnInit, AfterViewInit, EventEmitter, Output, OnDestroy, forwardRef, ViewChild, ElementRef, ContentChild, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { fromEvent, of, Subscription } from 'rxjs';
import { debounceTime,map,distinctUntilChanged,filter, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'tf-search-list-bar',
  templateUrl: './search-list-bar.component.html',
  styleUrls: ['./search-list-bar.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchListBarComponent),
    multi: true
  }]
})

export class SearchListBarComponent implements AfterViewInit, OnInit, OnDestroy {

  
  @ViewChild('searchInput', {static: false}) searchInput: ElementRef;

  loading = false;
  data: boolean = false;
  filter = {
    keyword: "",
  };
  statuses;

	// Private properties
  private readonly subscriptions: Subscription[] = [];
  
  @Input() hasAdvancedSearch: Boolean;
  @Input() showFilters: Boolean;
  @Output() change = new EventEmitter();
  @Output() advancedSearchChange = new EventEmitter();
  // @Output() advancedSearchDisplayChange = new EventEmitter();

  constructor(
		private cdr: ChangeDetectorRef,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) {
		iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  async ngOnInit(){
  }

  async ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement,'keyup')
      .pipe(
          filter(Boolean),
          debounceTime(300),
          distinctUntilChanged(),
      )
      .subscribe((text:string)=>{
        this.data = this.searchInput.nativeElement.value.length > 0 ? true : false;
        this.filter.keyword = this.searchInput.nativeElement.value;
        this.submit();
      });
  }

  submit() {
    this.change.emit(this.filter);
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
    this.data = false;
    this.searchInput.nativeElement.value = '';
    this.filter.keyword = null;
    this.submit();
  }
  
  toggleAdvancedSearch(){
    this.showFilters = !this.showFilters;
    this.advancedSearchChange.emit(this.showFilters);
  }
}
