import {ChangeDetectorRef, Component, OnInit, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Pdp} from '@app/core/models';
import {DocumentService, PdpService} from '@app/core/services';
import Swal from "sweetalert2";

import moment from 'moment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SendMailModalComponent} from '../send-mail-modal/send-mail-modal.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'tf-pdp-detail',
	templateUrl: './pdp-detail.component.html',
	styleUrls: ['./pdp-detail.component.scss']
})
export class PdpDetailComponent implements OnInit {

	@Input() fromGuest: any = null;
	pdp: Pdp;
	pdpLoaded: boolean = false;
	pdpPiman: boolean;

	sousTraitantEeColumns: string[] = ['name', 'mail', 'tel'];
	pdpConsigneeColumns: string[] = ['instructions', 'answer', 'comments_operation_type'];
	pdpEpiDispositioneeColumns: string[] = ['ppe', 'answer', 'filter', 'type', 'comment'];
	pdpMoyenDispositionEeColumns: string[] = ['moyen_disposition', 'answer', 'comment'];
	pdpTravauxDangereuxColumns: string[] = ['pdp_travaux_dangereux', 'answer'];
	pdpValidationsColumns: string[] = ['company', 'fullname', 'date', 'participation', 'visa'];
	intervenantsColumns: string[] = ['lastname', 'firstname', 'phone', 'training_auth', 'medical_follow_up', 'visa'];

	isExpanded: boolean = true;
	isDisableToggle: boolean = false;
	validationEditMode: boolean = false;
	intervenantEditMode: boolean = false;

	allowIntervenantToSign = false;

	constructor(
		protected activatedRoute: ActivatedRoute,
		protected router: Router,
		protected pdpService: PdpService,
		protected cdr: ChangeDetectorRef,
		protected _sanitizer: DomSanitizer,
		private translate: TranslateService,
		private documentService: DocumentService,
		protected modalService: NgbModal,
	) {
	}

	ngOnInit() {

		console.log(this.fromGuest);
		if (!this.fromGuest) {
			const routeSubscription = this.activatedRoute.params.subscribe(
				async params => {
					const id = params.id;
					if (id) {
						this.getPdp(id);
						if (this.pdpLoaded) {

						}
					} else {
						this.router.navigateByUrl('/plan-de-prevention/list');
					}
				});
		} else {
			this.pdpLoaded = false;
			var pdp = this.fromGuest.pdp
			this.parsePdpDate(pdp);
			this.pdpPiman = !(pdp.type.code == "PDP_CLIENT");
			pdp.documents = pdp.documents.filter(x => ['pdf'].indexOf(x.extension.toLowerCase()) != -1);
			pdp.documents.forEach(x => {
				x.src = this.documentService.readFile(x.id);
				x.image = this.documentService.readFile(x.id);
				x.thumbImage = this.documentService.readFile(x.id);
			});
			this.pdp = pdp;
			this.pdpLoaded = true;
			this.cdr.markForCheck();
		}
	}

	async getPdp(pdpId) {
		try {
			var res = await this.pdpService.get(pdpId).toPromise();
			this.parsePdpDate(res.result.data);
			var pdp = res.result.data;
			this.pdpPiman = !(pdp.type.code == "PDP_CLIENT");
			pdp.documents = pdp.documents.filter(x => ['pdf'].indexOf(x.extension.toLowerCase()) != -1);
			pdp.documents.forEach(x => {
				x.src = this.documentService.readFile(x.id);
				x.image = this.documentService.readFile(x.id);
				x.thumbImage = this.documentService.readFile(x.id);
			});
			this.pdp = pdp;
			this.allowIntervenantToSign = this.pdp.pdp_validations.filter(v => v.signature && (v.type === 'ee' || v.type === 'eu')).length === 2;

			this.pdpLoaded = true;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	parsePdpDate(item) {
		item.pdp_validations.forEach(validation => {
			validation.validation_at = moment(validation.validation_at, 'DD-MM-YYYY').format('YYYY-MM-DD');
			validation.part_inspection_at = moment(validation.part_inspection_at, 'DD-MM-YYYY').format('YYYY-MM-DD');
		});
		item.pdp_intervention_at = moment(item.pdp_intervention_at, 'DD-MM-YYYY').format('YYYY-MM-DD');
	}

	canBeSigned(type) {
		switch (type) {
			case'validation':
				return this.pdp.pdp_validations.filter((el) => {
					return this.fromGuest ? !el.signature && el.id == this.fromGuest.itemId : !el.signature
				}).length > 0
			default:
				return false;
		}
	}

	showValidationSignatureForm() {
		this.validationEditMode = true;
	}

	cancelValidationSignature() {
		this.validationEditMode = false;
	}

	showIntervenantSignatureFrom() {
		this.intervenantEditMode = true;
	}

	cancelIntervenantSignature() {
		this.intervenantEditMode = false;
	}

	onSignPDP($event) {
		this.intervenantEditMode = this.validationEditMode = false;
		this.getPdp(this.pdp.id);
	}

	sendForSign(el, el_type) {
		const modalRef = this.modalService.open(SendMailModalComponent, {size: 'lg'});
		modalRef.componentInstance.element = el;
		modalRef.componentInstance.el_type = el_type;
		modalRef.componentInstance.action = 'sendGuestAccess';
		modalRef.result.then((result) => {
			if (result) {
				Swal.fire({
					icon: 'success',
					title: this.translate.instant("ACTION.MAILS_SENDED"),
					showConfirmButton: false,
					timer: 1500
				});
			}
		}, (reason) => {

		});
		console.log(el, el_type)
	}

	downloadPdf() {
		if (this.pdp) this.pdpService.exportPdpPdf(this.pdp.id);
	}

	editPdp(pdp_id?) {
		this.router.navigate(['/plan-de-prevention/edit', pdp_id ? pdp_id : this.pdp.id], {relativeTo: this.activatedRoute});
	}

	duplicatePdp() {
		this.pdpService.duplicatePdp(this.pdp.id).toPromise().then((v: any) => {
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

	async deletePdp() {
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
					const res = await this.pdpService.delete(this.pdp.id).toPromise();
					if (res) {
						Swal.fire({
							icon: 'success',
							title: this.translate.instant("PDP.NOTIF.PDP_DELETED.TITLE"),
							showConfirmButton: false,
							timer: 1500
						}).then(() => {
							this.router.navigate(['/plan-de-prevention/list']);
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
}



