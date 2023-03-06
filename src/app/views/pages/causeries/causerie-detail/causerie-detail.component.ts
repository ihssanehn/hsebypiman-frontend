import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

import { CauserieService, DocumentService } from '@app/core/services';
import { Causerie } from '@app/core/models';

import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, User } from '@app/core/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParticipateCauserieModalComponent } from '@app/views/partials/layout/modal/participate-causerie-modal/participate-causerie-modal.component';
import { ImageLightboxContentDialogComponent, ShowDocumentModalComponent, AddUsersModalComponent } from '@app/views/partials/layout';
import { AddDocModalComponent } from '@app/views/partials/layout/modal/add-doc-modal/add-doc-modal.component';
import { FileUploader } from 'ng2-file-upload';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';

@Component({
  selector: 'tf-causerie-detail',
  templateUrl: './causerie-detail.component.html',
  styleUrls: ['./causerie-detail.component.scss']
})
export class CauserieDetailComponent implements OnInit, OnDestroy {
  
	authUser: User;
  	causerie: Causerie;
  	causerie_id: number;
	causerieForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	displayedParticipantsColumns: Array<any> = [
		'prenom',
		'nom',
		'email'
	];
	formDocStatus = new FormStatus();
	formDocloading: Boolean = false;
	public uploader: FileUploader = new FileUploader({isHTML5: true});
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param causerieFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private translate: TranslateService,
		private causerieService: CauserieService,
		private modalService: NgbModal,
		private cdr: ChangeDetectorRef,
		private authService: AuthService,
		private documentService: DocumentService,
		public dialog: MatDialog,
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer
	) {
		iconRegistry.addSvgIcon('status-encours',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/encours.svg'));
		iconRegistry.addSvgIcon('status-termine',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/termine.svg'));
	}

  	ngOnInit() {
	  	const routeSubscription = this.activatedRoute.params.subscribe(async params => {
				this.causerie_id = params.id;
				this.getCauserie()
			});
			const authSubscription = this.authService.getCurrentUser().subscribe(x => {
				this.authUser = x;
			});
	
			this.subscriptions.push(routeSubscription);
			this.subscriptions.push(authSubscription);
	}

	async getCauserie(){
		try {
			var res = await this.causerieService.get(this.causerie_id).toPromise();
			var causerie = res.result.data;
			causerie.images.forEach(x => {
				x.src = this.documentService.readFile(x.id);
				x.image = this.documentService.readFile(x.id);
				x.thumbImage = this.documentService.readFile(x.id);
			});
			this.causerie = causerie;
			this.cdr.markForCheck();
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
		const url = `/causeries/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

  	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshCauserie(id) {
		let url = this.router.url;
		url = `/causeries/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	editCauserie(id){
		this.router.navigateByUrl('causeries/edit/'+id);
	}

	deleteCauserie(id){
		if(this.causerie.participants.length > 0){
			Swal.fire({
				title: this.translate.instant("CAUSERIES.NOTIF.CAUSERIE_NOT_DELETED.LABEL"),
				showConfirmButton: false,
				timer: 1500
			})
		}else{
			this.causerieService.delete(id).toPromise().then(resp=>{
				Swal.fire({ icon: 'success', 
            title:this.translate.instant("CAUSERIES.NOTIF.CAUSERIE_DELETED.LABEL"), 
            showConfirmButton: false,
            timer: 1500 
          })
				this.goBackWithId();
			})
		}
	}

	hasParticipate(){
		return this.causerie.participants.find(x => x.id == this.authUser.id)
	}

	participate(){
		const modalRef = this.modalService.open(ParticipateCauserieModalComponent, {size: 'md',scrollable: true, centered : true});
		modalRef.componentInstance.causerie = this.causerie;
		modalRef.componentInstance.user = this.authUser;
		modalRef.result.then((payload)=>{
			this.addParticipant(payload);
		}, (err) => {});
	}

	editFeedBackParticipant(){
		var participant = this.hasParticipate();
		if(participant) {
			console.log(participant)
			const modalRef = this.modalService.open(ParticipateCauserieModalComponent, {size: 'md',scrollable: true, centered : true});
			modalRef.componentInstance.causerie = this.causerie;
			modalRef.componentInstance.user = this.authUser;
			modalRef.componentInstance.retourParticipant = participant.pivot.retour_participant;
	
			modalRef.result.then((payload)=>{
				this.addFeedBackParticipant(payload);
			}, (err) => {});
		}

	}

	openAddParticipants(){
		const modalRef = this.modalService.open(AddUsersModalComponent, {size: 'lg',scrollable: true,centered : true});
		modalRef.componentInstance.users_already_subscribed = this.causerie.participants;

		modalRef.result.then( 
			payload => {
				if(payload){
					this.causerieService.addParticipants(this.causerie.id, {user_ids: payload})
					.toPromise()
					.then(res=>{
						Swal.fire({
							icon:'success',
							title: this.translate.instant("CAUSERIES.NOTIF.PARTICIPANTS_ADDED.DONE"),
							showConfirmButton: false,
							timer: 1500
						})
						this.cdr.markForCheck();
						this.getCauserie();
					})
					// this.saveDocuments(payload), payload => this.saveDocuments(payload)
				}
			}, (err) => {}
		);
	}

	addParticipant(data) {
		try {
			this.causerieService.addParticipant(this.causerie.id, data)
			.toPromise()
			.then(res => {
				this.cdr.markForCheck();
				this.getCauserie();
			}).catch(err =>{ 
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

	addFeedBackParticipant(data) {
		try {
			this.causerieService.addFeedBackParticipant(this.causerie.id, this.authUser.id, data)
			.toPromise()
			.then(res => {
				this.cdr.markForCheck();
				this.getCauserie();
			}).catch(err =>{ 
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

	removeParticipant(participant_id){
		Swal.fire({
      icon: 'warning',
      title: this.translate.instant("CAUSERIES.NOTIF.DELETE_PARTICIPANT_CONFIRMATION.TITLE"),
      text: this.translate.instant("CAUSERIES.NOTIF.DELETE_PARTICIPANT_CONFIRMATION.LABEL"),
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant("ACTION.CANCEL"),
      confirmButtonText: this.translate.instant("ACTION.VALIDATE"),
    }).then(async response => {
      if (response.value) {
        this.causerieService.detachParticipant(this.causerie.id, participant_id).toPromise().then(res=>{
          this.getCauserie();
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("CAUSERIES.NOTIF.PARTICIPANT_DELETED.DONE"),
            showConfirmButton: false,
            timer: 1500,  
          })
          this.cdr.markForCheck();
        })
      }
    })
	}

	isUserOrganizer() {
		return this.authUser.id == this.causerie.organisateur.id || this.authUser.id == this.causerie.creator_id;
	}

	openAddImageModal(){
		const modalRef = this.modalService.open(AddDocModalComponent, {size: 'lg',scrollable: true,centered : true});
		modalRef.componentInstance.uploader = this.uploader;
		modalRef.componentInstance.accept = '.png, .bmp, .jpeg, .jpg, .gif, .tif, .heic';

		modalRef.result.then( 
			payload => {
				if(payload){
					this.saveDocuments(payload), payload => this.saveDocuments(payload)
				}
			}, (err) => {}
		);
	}

	openAddDocumentModal() {
		const modalRef = this.modalService.open(AddDocModalComponent, {size: 'lg',scrollable: true,centered : true});
		modalRef.componentInstance.uploader = this.uploader;
		modalRef.componentInstance.accept = '.pdf';

		modalRef.result.then( 
			payload => {
				if(payload){
					this.saveDocuments(payload), payload => this.saveDocuments(payload)
				}
			}, (err) => {}
		);
	}

	saveDocuments(payloads){
		Swal.fire({
			title: this.translate.instant("COMMON.NOTIF.UPLOADING.SHORTTITLE"),
			html: this.translate.instant("COMMON.NOTIF.UPLOADING.TITLE"),
			allowEscapeKey: false,
			allowOutsideClick: false,
			timerProgressBar: true,
			onOpen: () => {
				Swal.showLoading();
			}
		});

		this.formDocloading = true;
		let formData = new FormData();
		this.formDocStatus.onFormSubmitting();

		for (let j = 0; j < this.uploader.queue.length; j++) {
			let fileItem = this.uploader.queue[j]._file;
			formData.append('documents[]', fileItem);
		}

		this.causerieService.addDocuments(this.causerie.id, formData)
			.toPromise()
			.then((res) => {
				this.formDocloading = false;
				
				Swal.fire({
					icon: 'success',
					title: this.translate.instant("CAUSERIES.NOTIF.DOCS_ADDED.TITLE"),
					showConfirmButton: false,
					timer: 1500,
						
				}).then(() => {
					this.uploader.clearQueue();
					this.getCauserie();
				});
			})
			.catch(err =>{ 
				this.formDocloading = false;

				Swal.fire({
					icon: 'error',
					title: this.translate.instant("COMMON.NOTIF.INCOMPLETE_FORM.TITLE"),
					showConfirmButton: false,
					timer: 1500
				});

				if(err.status === 422){
					var messages = extractErrorMessagesFromErrorResponse(err);
					this.formDocStatus.onFormSubmitResponse({success: false, messages: messages});
					this.cdr.markForCheck();
				}
			});
			
		this.cdr.markForCheck();
	} catch (error) {
		this.formDocloading = false;
		console.error(error);
		throw error;
	}

	openModal(photos: any, index: number) {
		const dialogRef = this.dialog.open(ImageLightboxContentDialogComponent, {
			data: { images : photos, selectedImgIndex: index}
		});
	}

	showDocument(doc: any){
		const modalRef = this.modalService.open(ShowDocumentModalComponent, {size: 'lg',scrollable: true,centered : true, windowClass:'doc-modal'});
		modalRef.componentInstance.document = doc;
	}

	deleteImage(id: number) {
		Swal.fire({
			icon: 'warning',
			title: this.translate.instant("CAUSERIES.NOTIF.IMAGE_DELETE_CONFIRMATION.TITLE"),
			text: this.translate.instant("CAUSERIES.NOTIF.IMAGE_DELETE_CONFIRMATION.LABEL"),
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: this.translate.instant("ACTION.CANCEL"),
			confirmButtonText: this.translate.instant("ACTION.DELETE")
		}).then(async response => {
			if (response.value) {
				try {
					const res = await this.documentService.delete(id).toPromise();
					if (res) {
						Swal.fire({
							icon: 'success',
							title: this.translate.instant("CAUSERIES.NOTIF.IMAGE_DELETED.TITLE"),
							showConfirmButton: false,
							timer: 1500
						}).then(() => {
							this.getCauserie();
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

	deleteDocument(id: number) {
		Swal.fire({
			icon: 'warning',
			title: this.translate.instant("CAUSERIES.NOTIF.DOC_DELETE_CONFIRMATION.TITLE"),
			text: this.translate.instant("CAUSERIES.NOTIF.DOC_DELETE_CONFIRMATION.LABEL"),
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: this.translate.instant("ACTION.CANCEL"),
			confirmButtonText: this.translate.instant("ACTION.DELETE")
		}).then(async response => {
			if (response.value) {
				try {
					const res = await this.documentService.delete(id).toPromise();
					if (res) {
						Swal.fire({
							icon: 'success',
							title: this.translate.instant("CAUSERIES.NOTIF.DOC_DELETED.TITLE"),
							showConfirmButton: false,
							timer: 1500
						}).then(() => {
							this.getCauserie();
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

	hasPermission(right){
		return this.authService.hasPermission(right);
	}
}
