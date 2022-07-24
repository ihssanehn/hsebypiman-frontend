import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation } from '@app/core/models';
import { FormationService } from '@app/core/services';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'tf-formation-edit',
  templateUrl: './formation-edit.component.html',
  styleUrls: ['./formation-edit.component.scss']
})
export class FormationEditComponent implements OnInit, OnDestroy {

  formationForm: FormGroup;
	formation: Formation;
  formStatus = new FormStatus();
	formloading: boolean = false;
	loaded: boolean = false;
	editMode: boolean = false;
	subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private formationService: FormationService,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private location: Location,
		private dateFrToEnPipe:DateFrToEnPipe,
		private dateEnToFrPipe:DateEnToFrPipe,
  ) { }

  ngOnInit() {
    this.createForm();
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.formationService.get(id).pipe(
            tap(res=>{
              this.formationForm.patchValue(res.result.data);						
            })
          ).subscribe( async res => {
            this.formation = res.result.data;
            this.loaded = true;
            this.cdr.markForCheck();
          });

        } else {
          this.router.navigateByUrl('/formations/list');
        }
      }
    );
    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

  goBackWithId() {
		const url = `/formations/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.formationForm = this.fb.group({
      habilitation_id: [null],
      libelle: ['', Validators.required],
      description: [''],
      organisme_formation: [''],
      to_habilitation: [0],
		});
	}

  refreshFormation(id: number) {
		let url = this.router.url;
		url = `/formations/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

  saveForm(form){
    this.formloading = true;
    form.id = this.formation.id;

    this.formationService.update(form)
      .toPromise()
      .then((res) => {
        this.formloading = false;
        var code = res.message.code as SweetAlertIcon;
        var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
        Swal.fire({
          icon: code,
          title: this.translate.instant("FORMATIONS.NOTIF.FORMATION_UPDATED.TITLE"),
          showConfirmButton: false,
          html: message,
          timer: code == 'success' ? 1500 : 3000
        }).then(() => {
          this.location.back();
        })
        this.cdr.markForCheck();
      })
      .catch(err => {
        this.formloading = false;
        Swal.fire({
          icon: 'error',
          title: this.translate.instant("ARS.NOTIF.INCOMPLETE_FORM.TITLE"),
          showConfirmButton: false,
          timer: 1500
        });

        if(err.status === 422){
          var messages = extractErrorMessagesFromErrorResponse(err);
          this.formStatus.onFormSubmitResponse({success: false, messages: messages});
          this.cdr.markForCheck();
        }
      });
    this.cdr.markForCheck();
  }

  async onSubmit(event) {
		this.formStatus.onFormSubmitting();
		let form = {...this.formationForm.getRawValue()};
		this.saveForm(form)
	}

	cancel() {
		this.location.back();
	}

}
