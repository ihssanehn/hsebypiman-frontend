import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material";
import {debounceTime} from "rxjs/operators";
import {DateFrToEnPipe} from "@app/core/_base/layout";
import {PdpService, StatusService} from "@app/core/services";
import {Status} from "@app/core/models";

@Component({
	selector: 'tf-pdp-filters',
	templateUrl: './pdp-filters.component.html',
	styleUrls: ['./pdp-filters.component.scss']
})
export class PdpFiltersComponent implements OnInit {

	@Output() change = new EventEmitter();

	status: Status[];
	intervenant: any[] = [];
	types: any[] = [];
	filterForm: FormGroup;

	risks = [
		{key: 1, value: 'PDP.YES'},
		{key: 0, value: 'PDP.NO'}
	];
	constructor(
		private fb: FormBuilder,
		private statusService: StatusService,
		private cdr: ChangeDetectorRef,
		private pdpService: PdpService,
		private dateFrToEnPipe: DateFrToEnPipe,
		iconRegistry: MatIconRegistry,
		sanitizer: DomSanitizer,
	) {
		iconRegistry.addSvgIcon(
			'search', sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
	}

	ngOnInit() {
		this.getFiltersData();
		this.getStatus();
		this.initFiltersForm();
		this.filterForm.valueChanges.pipe(
			debounceTime(500)
		).subscribe(data => this.search(data));
	}

	async getFiltersData() {
		var res = await this.pdpService.getAllPdpFilters().toPromise();
		if (res.result.data) {
			// this.intervenant = (res.result.data as any).intervenant || [];
			this.types = (res.result.data as any).type || [];
		}
	}

	getStatus() {
		this.pdpService.getStatus().toPromise().then((v: any) => {
			this.status = v.result.data;
			this.cdr.markForCheck();
		});
	}

	initFiltersForm() {
		this.filterForm = this.fb.group({
			raison_sociale_eu: [null],
			intervenant: [null],
			date_creation_start: [null],
			date_creation_end: [null],
			date_validity_start: [null],
			date_validity_end: [null],
			lieu_intervention: [null],
			status: [null],
			type: [null],
			risque: [null],
		});
	}

	search(filters: any): void {

		const filter = {...this.filterForm.getRawValue()};
		filter.date_creation_start = this.dateFrToEnPipe.transform(filter.date_creation_start);
		filter.date_creation_end = this.dateFrToEnPipe.transform(filter.date_creation_end);
		filter.date_validity_start = this.dateFrToEnPipe.transform(filter.date_validity_start);
		filter.date_validity_end = this.dateFrToEnPipe.transform(filter.date_validity_end);

		this.change.emit(filter);
	}

	formHasValue(key) {
		return !!this.filterForm.get(key).value;
	}

	clearValue(key) {
		this.filterForm.get(key).patchValue(null);
	}
}
