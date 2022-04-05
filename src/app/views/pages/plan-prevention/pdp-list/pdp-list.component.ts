import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Paginate} from '@app/core/_base/layout/models/paginate.model';
import {Pdp, Status} from '@app/core/models';
import {ActivatedRoute, Router} from '@angular/router';
import {ArService, PdpService} from '@app/core/services';
import {TranslateService} from '@ngx-translate/core';
import Swal from "sweetalert2";
import {MatDialog} from '@angular/material/dialog';


@Component({
	selector: 'tf-pdp-list',
	templateUrl: './pdp-list.component.html',
	styleUrls: ['./pdp-list.component.scss']
})
export class PdpListComponent implements OnInit {
	@ViewChild('sendMailModal', {static: false})
	private sendMailModal: TemplateRef<any>;

	private sendMailModalRef;

	public pdpsList: Paginate<Pdp>;
	pagination: any = {
		page: 1,
		last_page: 1,
		total: 10,
		pageSize: 10,
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		order_by: ['created_at'],
		order_way: 'desc',
		keyword: '',
	};
	showFilters = false;
	displayedArColumns = ['raison_sociale_eu', 'cse', 'created_at', 'validity_at', 'lieu_intervention', 'risque', 'status', 'type', 'action'];

	pdp_id: number;
	status: Status[];
	newStatus: Status;
	commentShown: boolean = false;


	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		protected pdpService: PdpService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
		public dialog: MatDialog
	) {
	}

	ngOnInit() {
		this.getPDPs();
		this.getStatus();

	}

	async getPDPs() {
		try {
			let res = await this.pdpService.getAll(this.filter).toPromise();
			this.pdpsList = res.result.data;
			console.log(this.pdpsList);
			this.pagination = {
				...this.pagination,
				total: this.pdpsList.total,
				page: this.pdpsList.current_page,
				last_page: this.pdpsList.last_page
			};
			this.filter.page = this.pagination.page;
			this.filter.per_page = this.pagination.pageSize;
			if (!this.cdr['destroyed']) {
				this.cdr.detectChanges();
			}
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	changePagination() {
		this.pagination = {
			...this.pagination,
			pageSize: this.pagination.pageSize,
			total: this.pagination.total,
			last_page: this.pagination.last_page
		};
		this.filter.page = this.pagination.page;
		this.filter.per_page = this.pagination.pageSize;
		this.getPDPs();
	}

	setOrder(by) {
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay();
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getPDPs();
	}

	toggleOrderWay() {
		if (this.filter.order_way === 'asc') {
			this.filter.order_way = 'desc';
		} else {
			this.filter.order_way = 'asc';
		}
	}

	isOrderedBy(by) {
		if (Array.isArray(by)) {
			return JSON.stringify(by) === JSON.stringify(this.filter.order_by);
		} else {
			return by === this.filter.order_by;
		}
	}

	advancedSearchChanged($event) {
		this.showFilters = $event;
	}

	udpateFilters(filters) {
		for (let [key, value] of Object.entries(filters)) {
			this.filter[key] = value;
		}
		this.getPDPs();
	}

	exportList() {
		const filters = {...this.filter};
		filters.type_file = "EXCEL";
		return this.pdpService.export(filters);
	}

	editPdp(pdpId) {
		this.router.navigate(['../edit', pdpId], {relativeTo: this.activatedRoute});
	}

	duplicatePdp(pdpId) {
		this.pdpService.duplicatePdp(pdpId).toPromise().then((v: any) => {
			Swal.fire({
				title: this.translate.instant('PDP.NOTIF.ELEMENT_DUPLICATED.TITLE'),
				showConfirmButton: false,
				icon: 'success',
				timer: 1500
			}).then(() => {
				if (v && v.result && v.result.data) {
					this.editPdp(v.result.data.id);
				}
			});
		}).catch(() => {
			Swal.fire({
				icon: 'error',
				title: this.translate.instant('NOTIF.ERROR_OCCURED.TITLE'),
				showConfirmButton: false,
				timer: 1500
			});
		});
	}

	viewPdp(pdpId) {
		this.router.navigate(['../detail', pdpId], {relativeTo: this.activatedRoute});
	}

	signPdp(pdpId) {
		this.router.navigate(['../sign', pdpId], {relativeTo: this.activatedRoute});
	}

	// Trigger a PopUp asking to SSE Manager if he wants to accept or refuse the Pdp
	// Set the state of pdp in function of the response.
	validatePdp(pdpId) {
		Swal.fire({
			icon: 'info',
			title: this.translate.instant("ACTION.VALIDATE"),
			showConfirmButton: true,
			showCancelButton: true,
			confirmButtonText: this.translate.instant("PDP.YES"),
			cancelButtonText: this.translate.instant("PDP.NO"),
			showCloseButton: true,

		}).then((result) => {
			//Yes
			if (result.isConfirmed) {
				//Set the next Status thanks to the order property.
				const status = {
					"status": this.status.find(status => status.ordre == 3)
				}
				this.pdpService.changeStatus(pdpId, status).subscribe((res) => {
					Swal.fire({
						title: this.translate.instant("PDP.NOTIF.STATUS_ACCEPTED.TITLE"),
						showConfirmButton: false,
						icon: 'success',
						timer: 1500
					})
					this.getPDPs();
				});


				//No
			} else if (result.dismiss == Swal.DismissReason.cancel) {
				console.log(result.dismiss)

				Swal.fire({
					icon: 'question',
					title: this.translate.instant("PDP.NOTIF.COMMENTS"),
					showConfirmButton: true,
					input: 'textarea',
					inputPlaceholder: 'Commentaires ...',
					cancelButtonText: this.translate.instant("ACTION.UNVALIDATE"),
					confirmButtonText: this.translate.instant("ACTION.CONFIRM"),

				}).then((result) => {
						if (result.value) {
							//TODO -> STORE COMMS wich are currently in result.value
						}
						//The Pdp's State is reset to first state and signature are canceled
						const status = {
							"status": this.status.find(status => status.ordre == 1)
						}
						this.pdpService.changeStatus(pdpId, status).subscribe((res) => {
							this.getPDPs();
						});
						this.pdpService.removeValidationsSignatures(pdpId).subscribe((res) => {
							Swal.fire({
								title: this.translate.instant("PDP.NOTIF.STATUS_REFUSED.TITLE"),
								showConfirmButton: false,
								icon: 'success',
								timer: 1500
							})

						});
						console.log(result.value);
					}
				);
			}
		});
	}


	async deletePdp(pdpId) {
		Swal.fire({
			icon: 'warning',
			title: this.translate.instant("PDP.NOTIF.PDP_DELETE_CONFIRMATION.TITLE"),
			text: this.translate.instant("PDP.NOTIF.PDP_DELETE_CONFIRMATION.LABEL"),
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: this.translate.instant("ACTION.CANCEL"),
			confirmButtonText: this.translate.instant("ACTION.DELETE")
		}).then(async response => {
			if (response.value) {
				try {
					const res = await this.pdpService.delete(pdpId).toPromise();
					if (res) {
						Swal.fire({
							icon: 'success',
							title: this.translate.instant("PDP.NOTIF.PDP_DELETED.TITLE"),
							showConfirmButton: false,
							timer: 1500
						}).then(() => {
							this.getPDPs();
						});
					} else {
						throw new Error();
					}
				} catch (e) {
					Swal.fire({
						icon: 'error',
						title: this.translate.instant("NOTIF.ERROR_OCCURED.TITLE"),
						showConfirmButton: false,
						timer: 1500
					});
				}
			}
		});
	}

	getPdp(pdpId) {
		return this.pdpsList.data.find(pdp => pdp.id == pdpId);
	}

	getStatus() {
		this.pdpService.getStatus().subscribe((res: any) => {
			this.status = res.result.data;
		});
	}

	openMailModal(pdpId) {
		this.sendMailModalRef = this.dialog.open(this.sendMailModal, {data: {name: 'austin'}});
	}

	closeMailModal() {
		this.sendMailModalRef.close();
	}

	sendMail(event) {
		//TODO SEND EMAIL
		console.log(event);
		this.sendMailModalRef.close();
		Swal.fire({
			icon: 'success',
			title: this.translate.instant("PDP.NOTIF.EMAIL_SENT.TITLE"),
			showConfirmButton: false,
			timer: 1500
		}).then(() => {
			this.getPDPs();
		});
	}

	downloadPdf(pdpId) {
		this.pdpService.exportPdpPdf(pdpId);
	}

}
