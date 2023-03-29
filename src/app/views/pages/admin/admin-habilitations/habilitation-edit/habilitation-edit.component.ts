import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Habilitation } from '@app/core/models';
import { HabilitationService } from '@app/core/services';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'tf-habilitation-edit',
  templateUrl: './habilitation-edit.component.html',
  styleUrls: ['./habilitation-edit.component.scss']
})
export class HabilitationEditComponent implements OnInit, OnDestroy {

  habilitationForm: FormGroup;
  habilitation: Habilitation;
  formStatus = new FormStatus();
  formloading: boolean = false;
  loaded: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private habilitationService: HabilitationService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private location: Location,
    private dateFrToEnPipe: DateFrToEnPipe,
    private dateEnToFrPipe: DateEnToFrPipe,
  ) { }

  ngOnInit() {
    this.createForm();
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.habilitationService.get(id).pipe(
            tap(res => {
              this.habilitationForm.patchValue(res.result.data);
            })
          ).subscribe(async res => {
            this.habilitation = res.result.data;
            this.loaded = true;
            this.cdr.markForCheck();
          });

        } else {
          this.router.navigateByUrl('/habilitations/list');
        }
      }
    );
    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  goBackWithId() {
    const url = `/habilitations/list`;
    this.router.navigateByUrl(url, {
      relativeTo: this.activatedRoute
    });
  }

  createForm() {
    this.habilitationForm = this.fb.group({
      libelle: ['', Validators.required],
      cat_hab_id: [null, Validators.required],
      duree_validite: [null],
      active: [1]
    });
  }

  refreshHabilitation(id: number) {
    let url = this.router.url;
    url = `/habilitations/edit/${id}`;
    this.router.navigateByUrl(url, {
      relativeTo: this.activatedRoute
    });
  }

  saveForm(form) {
    this.formloading = true;
    form.id = this.habilitation.id;

    this.habilitationService.update(form)
      .toPromise()
      .then((res) => {
        this.cdr.markForCheck();
        this.formloading = false;
        Swal.fire({
          icon: 'success',
          title: this.translate.instant("HABILITATIONS.NOTIF.HABILITATION_UPDATED.TITLE"),
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/admin/habilitations/detail/' + this.habilitation.id]);
        });
      })
      .catch(err => {
        console.log(err);
        this.formloading = false;
        Swal.fire({
          icon: 'error',
          title: this.translate.instant("ARS.NOTIF.INCOMPLETE_FORM.TITLE"),
          showConfirmButton: false,
          timer: 1500
        });

        if (err.status === 422) {
          var messages = extractErrorMessagesFromErrorResponse(err);
          this.formStatus.onFormSubmitResponse({ success: false, messages: messages });
          this.cdr.markForCheck();
        }
      });
  }

  async onSubmit(event) {
    this.formStatus.onFormSubmitting();
    let form = { ...this.habilitationForm.getRawValue() };
    this.saveForm(form)
  }

  cancel() {
    this.location.back();
  }

}
