import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PeriodService } from '@app/core/services';
import Swal from 'sweetalert2';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import { FollowUpPeriod } from '@app/core/models';
import { MatInput, MatDatepickerInput, DateAdapter } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'tf-suivi-hse-periods-add',
  templateUrl: './suivi-hse-periods-add.component.html',
  styleUrls: ['./suivi-hse-periods-add.component.scss']
})
export class SuiviHsePeriodsAddComponent implements OnInit, AfterViewInit, OnDestroy {

	loaded = false;
  periodForm: FormGroup;
  formloading: boolean = false;
  private subscriptions: Subscription[] = [];
  minStartDatePeriod: Date;
  periodList: FollowUpPeriod[];

  @ViewChild(MatInput, {static: false}) formFieldControl: MatInput;
  @ViewChild(MatDatepickerInput, {static: false}) datepickerInput: MatDatepickerInput<any>;
  @ViewChild('dateInput', {static: false}) dateInput: ElementRef;

  maskConfig = {
    mask: [
      new RegExp('\\d'),
      new RegExp('\\d'),
      '/',
      new RegExp('\\d'),
      new RegExp('\\d'),
      '/',
      new RegExp('\\d'),
      new RegExp('\\d'),
      new RegExp('\\d'),
      new RegExp('\\d')
    ],
    showMask: false,
    guide: false,
    placeholderChar: '_'
  };

  eventSubscription: Subscription;

  filteredDates = (d: Date): boolean => {
    return this.checkDateValidation(d);
  }

  constructor(
    public periodService: PeriodService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<any>
  ) { 
    this.dateAdapter.setLocale(localStorage.getItem('language') || this.translate.getDefaultLang());
  }

  ngOnInit() {
    this.createForm();
    this.getPeriods();
    this.getSelectedPeriod();
  }

  ngAfterViewInit() {
    this.eventSubscription = fromEvent(this.dateInput.nativeElement, 'input').subscribe(_ => {
      this.datepickerInput._onInput(this.dateInput.nativeElement.value);
    });
    
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  async getPeriods(){
    var res = await this.periodService.getList().toPromise();
    this.periodList = res.result.data;
    this.cdr.markForCheck();
  }

  checkDateValidation(date){
    if(this.periodList.length > 0){
      return this.periodList
        .map(period => { 
          var start = new Date(period.start_date); start.setDate( start.getDate() - 1 );
          var end = new Date(period.end_date);
          return !(date >= start && date <= end)
        })
        .reduce((prev, curr) => prev && curr);
    }else{
      return true;
    }
  }

  async getSelectedPeriod(){
    await this.periodService.getLatest().toPromise()
    .then((res:any) => {
      if(res){
        var period = res.result.data;
        if(period){
          this.addDay(period.end_date);
        }
      }
    });
  }

  addDay(date){
    this.minStartDatePeriod = new Date(date);
    this.minStartDatePeriod.setDate( this.minStartDatePeriod.getDate() + 1 );
  }

  createForm() {
    this.periodForm = this.fb.group({
      start_date: [null],
      end_date: [null]
    })

		this.loaded = true;
  }
  
  onCancel(){
    this.activeModal.close();
  }

  onSubmit(){
    try {
      let form = {...this.periodForm.getRawValue()};
      this.formatDates(form, 'FrToEn');

      this.periodService.create(form)
        .toPromise()
        .then((res) => {
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("SUIVI_HSE.NOTIF.PERIOD_ADDED.TITLE"),
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.activeModal.close(res.result.data);
          });
        })
        .catch(err =>{ 

          Swal.fire({
            icon: 'error',
            title: this.translate.instant("NOTIF.INCOMPLETE_FORM.TITLE"),
            showConfirmButton: false,
            timer: 1500
          });

        });
        
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  formatDates(item, direction){
    item.start_date = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.start_date) : this.dateEnToFrPipe.transform(item.start_date);
    item.end_date = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.end_date) : this.dateEnToFrPipe.transform(item.end_date);
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.periodForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.invalid && (control.dirty || control.touched);
    return result;
  }

}
