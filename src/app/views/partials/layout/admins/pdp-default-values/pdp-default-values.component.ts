import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PdpDefaultValuesService} from '@app/core/services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'tf-pdp-default-values',
	templateUrl: './pdp-default-values.component.html',
	styleUrls: ['./pdp-default-values.component.scss']
})
export class PdpDefaultValuesComponent implements OnInit {


	pdpForm: FormGroup;

	tpl: any;
	isEdit = false;
	formloading = false;
	defaultValues: {
		cse_ee_job?: null,
		cse_ee_name?: null,
		cse_ee_tel?: null,
		hse_ee_job?: null,
		hse_ee_mail?: null,
		hse_ee_name?: null,
		hse_ee_tel?: null,
		id?: null,
		raison_sociale_ee?: null,
		raison_sociale_tel_ee?: null,
		sauveteurs_secouriste_travail_ee?: null
	} = null;

	@Input() title: string;

	constructor(private pdpDefaultValuesService: PdpDefaultValuesService,
				private cdr: ChangeDetectorRef,
				private pdpFB: FormBuilder,
				private translate: TranslateService) {
	}

	ngOnInit() {
		this.getList();
		this.createForm();
		this.tpl = {
			title: this.translate.instant('PDP.CARD.DEFAULT_VALUES_PDP.SHORTTITLE'),
			collapsed: true,
			childCol: 12
		};
	}


	async getList() {
		try {
			this.pdpDefaultValuesService.getAllAsAdmin().toPromise().then(v => {
				this.defaultValues = v.result.data ? v.result.data[0] : null;
				this.cdr.markForCheck();

			});
		} catch (error) {
			console.error(error);
		}
	}

	startEdit() {
		this.isEdit = true;
		this.tpl.collapsed = false;
		this.pdpForm.patchValue(this.defaultValues);
	}

	stopEdit() {
		this.isEdit = false;
	}

	createForm() {
		this.pdpForm = this.pdpFB.group({
			raison_sociale_ee: [null, Validators.required],
			raison_sociale_tel_ee: [null, Validators.required],
			sauveteurs_secouriste_travail_ee: [null, Validators.required],
			cse_ee_name: [null],
			cse_ee_job: [null],
			cse_ee_tel: [null],
			hse_ee_name: [null],
			hse_ee_mail: [null, Validators.email],
			hse_ee_tel: [null],
			hse_ee_job: [null],
		});
	}

	isControlHasError(controlName: string, validationType: string, ArrayFormName = null, index = null): boolean {
		if (!this.pdpForm) {
			return false;
		}
		const control = this.pdpForm.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validationType) && (control.dirty || control.touched);
	}

	async onSubmitEdit() {
		this.pdpForm.markAllAsTouched();
		if (this.pdpForm.valid) {
			try {
				this.formloading = true;
				this.defaultValues = await this.pdpDefaultValuesService.update({
					...this.pdpForm.getRawValue(),
					id: this.defaultValues.id
				}).toPromise();
				this.formloading = false;
				this.stopEdit();
				this.cdr.markForCheck();
			} catch (error) {
				console.error(error);
				this.formloading = false;
			}
		}

	}
}
