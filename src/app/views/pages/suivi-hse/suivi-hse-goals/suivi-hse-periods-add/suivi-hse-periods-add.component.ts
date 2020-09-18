import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PeriodService } from '@app/core/services';
import Swal from 'sweetalert2';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';


@Component({
  selector: 'tf-suivi-hse-periods-add',
  templateUrl: './suivi-hse-periods-add.component.html',
  styleUrls: ['./suivi-hse-periods-add.component.scss']
})
export class SuiviHsePeriodsAddComponent implements OnInit {

	loaded = false;
  periodForm: FormGroup;
  formloading: boolean = false;
  private subscriptions: Subscription[] = [];
  minStartDatePeriod: Date;


  constructor(
    public periodService: PeriodService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
  ) { }

  ngOnInit() {
    this.createForm();
    this.getSelectedPeriod();
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

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
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
            title: 'Période ajoutée avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.activeModal.close(res.result.data);
          });
        })
        .catch(err =>{ 

          Swal.fire({
            icon: 'error',
            title: 'Echec! le formulaire est incomplet',
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

}
