import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs";
import { Location } from '@angular/common';
import { RemonteeService, DocumentService, ModuleService } from '@app/core/services';
import { Remontee } from '@app/core/models';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { ShowDocumentModalComponent } from '@app/views/partials/layout/modal/show-document-modal/show-document-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ImageLightboxContentDialogComponent } from '@app/views/partials/layout/modal/image-lightbox-content-dialog/image-lightbox-content-dialog.component';

@Component({
  selector: 'tf-remontee-detail-base',
  templateUrl: './remontee-detail-base.component.html',
  styleUrls: ['./remontee-detail-base.component.scss']
})
export class RemonteeDetailBaseComponent implements OnInit {

  @Input() id: boolean;

	
	remontee: Remontee;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	displayedEEChantiersColumns: Array<any>;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param remonteFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private remonteeService: RemonteeService,
		private documentService: DocumentService,
		private moduleService: ModuleService,
		private location: Location,
		private modalService: NgbModal,
		private cdr: ChangeDetectorRef,
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer,
		private translate:TranslateService
	) {
		iconRegistry.addSvgIcon('status-encours',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/encours.svg'));
		iconRegistry.addSvgIcon('status-termine',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/termine.svg'));
	}

	ngOnInit() {
		if (this.id) {
      this.getRemonte(this.id);
    } else {
      this.router.navigateByUrl('/remontees/list');
    }
	}

	async getRemonte(remonteId){
		try {
			var res = await this.remonteeService.get(remonteId).toPromise();
			var remontee = res.result.data;
			remontee.photos = remontee.documents.filter(x => ['jpg','bmp','jpeg','gif','png','tif','heic'].indexOf(x.extension.toLowerCase()) != -1);
			remontee.photos.forEach(x=>{
				x.src = this.documentService.readFile(x.id);
				x.image = this.documentService.readFile(x.id);
				x.thumbImage = this.documentService.readFile(x.id);
			});
			this.remontee = remontee;
			this.cdr.markForCheck()
		} catch (error) {
			console.error(error);
		}
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/remontees/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  
  	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshRemonte(id) {
		let url = this.router.url;
		url = `/remontees/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  	}

	goToChantierDetail(id){
		let url = this.router.url;
		url = `/chantiers/detail/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	editRemonte(id){
		this.router.navigateByUrl('remontees/edit/'+id);
	}
	deleteRemonte(remonteId) {
		Swal.fire({
				icon: 'warning',
				title: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETE_CONFIRMATION.TITLE"),
				text: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETE_CONFIRMATION.LABEL"),
				showConfirmButton: true,
				showCancelButton: true,
				cancelButtonText: this.translate.instant("ACTION.CANCEL"),
				confirmButtonText: this.translate.instant("ACTION.DELETE"),
			}).then(async response => {
				if (response.value) {

					this.remonteeService.delete(remonteId).toPromise().then(res=>{
						Swal.fire({
							title: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETED.TITLE"),
							showConfirmButton: false,
							icon: 'success',
							timer: 1500
						}).then(() => {
							this.router.navigateByUrl('/remontees/list');
						});
					})
				}
			})
	}
	viewChantier(chantierId) {
		this.router.navigateByUrl('chantiers/detail/' + chantierId);
	}

	showDocument(doc){
		const modalRef = this.modalService.open(ShowDocumentModalComponent, {size: 'lg',scrollable: true,centered : true, windowClass:'doc-modal'});
		modalRef.componentInstance.document = doc;
	}

	downloadDoc(doc){
		return this.documentService.downloadFile(doc.id);
	}

	onAddComment(newComment: string){
		try {
			let comment = {
				'comment': newComment
			};
	  
			this.remonteeService.addComment(this.remontee.id, comment)
			  .toPromise()
			  .then((res) => {
				this.cdr.markForCheck();
				this.remontee.comments.push(res.result.data);
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


	isActiveModule(codes){
		return this.moduleService.isActived(codes);
	}

	goToAction(){
		return this.router.navigateByUrl('plan-actions/detail/'+this.remontee.action.id);
	}


  openModal(photos, index) {

    const dialogRef = this.dialog.open(ImageLightboxContentDialogComponent, {
      data: { images : photos, selectedImgIndex: index}
    });
		// this.remontee.documents.map(x=>x.id).indexOf(id)
  }

	denyRemontee(){
		Swal.fire({
			icon: 'warning',
			title: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETE_CONFIRMATION.TITLE"),
			text: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETE_CONFIRMATION.LABEL"),
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: this.translate.instant("ACTION.CANCEL"),
			confirmButtonText: this.translate.instant("ACTION.DELETE")
		}).then(async response => {
			if (response.value) {
				try {
					const res = await this.remonteeService.delete(this.remontee.id).toPromise();
					if (res) {
						Swal.fire({
							icon: 'success',
							title: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETED.TITLE"),
							showConfirmButton: false,
							timer: 1500
						}).then(() => {
							this.location.back()
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
	approveRemontee(){
		var _remontee = {
			id:this.remontee.id,
			is_approved: true
		};

		this.remonteeService.update(_remontee.id, _remontee).toPromise().then(res=>{
			this.remontee.is_approved = res.result.data.is_approved
			Swal.fire({
				icon: 'success',
				title: this.translate.instant("REMONTEES.NOTIF.LIFT_UPDATED.TITLE"),
				showConfirmButton: false,
				timer: 1500
			}).then(() => {
				this.cdr.markForCheck();
			});
		}).catch(err=>{
			console.log(err)
		})
	}

	async createActionFromRemontee() {
		const res = await this.remonteeService.createAction(this.remontee.id).toPromise();
		if (res) {
			Swal.fire({
				icon: 'success',
				title: this.translate.instant("PLANACTIONS.NOTIF.ACTION_CREATED.TITLE"),
				showConfirmButton: false,
				timer: 1500
			}).then(() => {
				this.getRemonte(this.remontee.id);
			});
		} else {
			throw new Error();
		}
	}

}
