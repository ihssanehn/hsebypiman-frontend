import { ChangeDetectorRef, Component, OnInit, AfterViewInit, EventEmitter, Output, OnDestroy, forwardRef, ViewChild, ElementRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { fromEvent, of, Subscription } from 'rxjs';
import { debounceTime,map,distinctUntilChanged,filter, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { ChantierService, TypeService, StatusService } from '@app/core/services';
import { Chantier, Type, Status } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';

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
  data: boolean = false;
  users: User[];
  status: Status[];
  types: Type[];
  clients: String[];
  filter = {
    keyword: "",
    dateRange: [],
    status_id: "",
    type_id: "",
    client:"",
    charge_affaire_id: null,
  };
  statuses;

	// Private properties
  private readonly subscriptions: Subscription[] = [];
  
  @Output() change = new EventEmitter();
  constructor(
    private statusService: StatusService,
    private chantierService:ChantierService, 
    private typeService:TypeService,
    private authService:AuthService,
		iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
  ) {
		iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
  }

  async ngOnInit(){
    this.getUsers();
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


  // Load ressources needed
  async getUsers(){
    this.users = await this.authService.getAllUsers().toPromise();
  }
  async getStatus(){
    this.status = await this.statusService.getAllFromModel('Chantier').toPromise();
  }
  async getClients(){
    this.clients = await this.chantierService.getAllClients().toPromise();
  }
  async getTypes(){
    this.types = await this.typeService.getAllFromModel('Chantier').toPromise();
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
  
}
