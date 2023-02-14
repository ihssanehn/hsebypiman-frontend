import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

import { MaterielService,  DocumentService } from '@app/core/services';
import { Materiel, Document } from '@app/core/models';
import {PretModalComponent, ImageLightboxContentDialogComponent, RevisionModalComponent, ShowDocumentModalComponent} from '@app/views/partials/layout';
import {MatDialog} from '@angular/material/dialog';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { AddDocModalComponent } from '@app/views/partials/layout/modal/add-doc-modal/add-doc-modal.component';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';


@Component({
  selector: 'tf-materiel-detail',
  templateUrl: './materiel-detail.component.html',
  styleUrls: ['./materiel-detail.component.scss']
})
export class MaterielDetailComponent implements OnInit, OnDestroy {
  
	materiel: Materiel;
	materielForm: FormGroup;
	formStatus = new FormStatus();
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	selectedUserId: number;
	formDocloading: boolean = false;
	public uploader:FileUploader = new FileUploader({
    isHTML5: true
  });
	errors;
	subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param materielFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private materielService: MaterielService,
		private documentService : DocumentService,
		private translate: TranslateService,
		private cdr: ChangeDetectorRef,
		private modalService: NgbModal,
		private _sanitizer: DomSanitizer,
	) {}

  	ngOnInit() {
	  	const routeSubscription = this.activatedRoute.params.subscribe(
		  	async params => {
			  	const id = params.id;
			  	if (id) {
					this.getMateriel(id);

				} else {
					this.router.navigateByUrl('/materiel/list');
				}
			}

		);
		this.subscriptions.push(routeSubscription);
	}

	async getMateriel(materielId){
		try {
			var res = await this.materielService.get(materielId).toPromise();
			this.materiel = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	isCurrentUser(pretId: number) {
		var currentPretId = this.materiel.actual_user.map(user => user.pivot.id);
		return currentPretId.includes(pretId);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/materiel/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  
  	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshMateriel(id) {
		let url = this.router.url;
		url = `/materiel/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}


	goToUserDetail(){
		Swal.fire({
			title: this.translate.instant("NOTIF.FEATURE_NOT_IMPLEMENTED.TITLE"),
			showConfirmButton: false,
            timer: 1500
		})
	}

	editMateriel(id){
		this.router.navigateByUrl('materiel/edit/'+id);
	}

	deleteMateriel(id){
		Swal.fire({
			title: this.translate.instant("NOTIF.FEATURE_NOT_IMPLEMENTED.TITLE"),
			showConfirmButton: false,
            timer: 1500
		})
	}

	openPretModal(origin = 'add',data = {}): void {
		const dialogRef = this.dialog.open(PretModalComponent, {
		  data: {origin: origin, pivot: data}
		});
	
		dialogRef.afterClosed().subscribe(result => {
			if(result){
				if(origin == 'add'){
					this.assignUser(result)
				}else{
					this.updatePret(result)
				}
			}
		});
	}

	async updatePret(params){
		try {
			var res = await this.materielService.updatePret(this.materiel.id, params).toPromise();
			var data = res.result.data;

			if(data) {
				this.materiel = data;
				Swal.fire({
					icon: 'success',
					title: this.translate.instant("MATERIELS.NOTIF.LOAN_UPDATED.TITLE"),
					showConfirmButton: false,
					timer: 1500
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: this.translate.instant("MATERIELS.NOTIF.MATERIAL_QUANTITY_NOT_AVAILABLE.TITLE"),
					showConfirmButton: false,
					timer: 1500
				});
			}
			this.cdr.markForCheck();

		} catch (error) {
			console.error(error);
		}
	}

	async assignUser(params){
		try {
			var res = await this.materielService.createPret(this.materiel.id, params).toPromise();
			var data = res.result.data;

			if(data) {
				this.materiel = data;
				Swal.fire({
					icon: 'success',
					title: this.translate.instant("MATERIELS.NOTIF.LOAN_CREATED.TITLE"),
					showConfirmButton: false,
					timer: 1500
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: this.translate.instant("MATERIELS.NOTIF.MATERIAL_QUANTITY_NOT_AVAILABLE.TITLE"),
					showConfirmButton: false,
					timer: 1500
				});
			}
			this.cdr.markForCheck();

		} catch (error) {
			console.error(error);
		}
	}

	openRevisionModal(origin = 'add',data = {}): void {
		const dialogRef = this.dialog.open(RevisionModalComponent, {
		  data: {materiel: this.materiel}
		});
	
		dialogRef.afterClosed().subscribe(result => {
			if(result){
				Swal.fire({
					icon: 'success',
					title: this.translate.instant("MATERIELS.NOTIF.MATERIEL_UPDATED.TITLE"),
					showConfirmButton: false,
					timer: 1500
				})
				this.getMateriel(this.materiel.id)
			}
		});
	}


	getEtat(){
		if(this.materiel.main_categorie.code == "BATIMENT"){
			if(this.materiel.etat == 1){
				return "OUI"
			}else if(this.materiel.etat == 0){
				return "NON"
			}
		}else{
			if(this.materiel.etat == 1){
				return "Fonctionnel"
			}else if(this.materiel.etat == 0){
				return "Hors Service"
			}
		}
	}

	openAddDocumentModal(doc_id){
		const modalRef = this.modalService.open(AddDocModalComponent, {size: 'lg',scrollable: true,centered : true});
		modalRef.componentInstance.uploader = this.uploader;
		modalRef.componentInstance.accept = '.png, .bmp, .jpeg, .jpg, .gif, .tif, .doc, .docx, .pdf';
		modalRef.result.then( payload => {this.saveDocuments(payload)});
	}

	saveDocuments(payloads){

		this.formDocloading = true;
		let formData = new FormData();
		this.formStatus.onFormSubmitting();

		for (let j = 0; j < this.uploader.queue.length; j++) {
			let fileItem = this.uploader.queue[j]._file;
			formData.append('documents[]', fileItem);
		}

		this.materielService.addDocuments(this.materiel.id, formData)
			.toPromise()
			.then((res) => {
				this.formDocloading = false;
				this.errors = false; 
				this.getMateriel(this.materiel.id);
				this.uploader.clearQueue();
				
				Swal.fire({
					icon: 'success',
					title: this.translate.instant("VISITES.NOTIF.DOCS_ADDED.TITLE"),
					showConfirmButton: false,
					timer: 1500,
				})
			})
			.catch(err =>{ 
				this.formDocloading = false;

				Swal.fire({
					icon: 'error',
					title: this.translate.instant("NOTIF.INCOMPLETE_FORM.TITLE"),
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
	openDocumentModal(document){
		const modalRef = this.modalService.open(ShowDocumentModalComponent, {size: 'xl',scrollable: true,centered : true, windowClass:'doc-modal'});
		modalRef.componentInstance.document = document;
	}
	deleteDocument(document_id){
		Swal.fire({
      icon: 'warning',
      title: this.translate.instant("MATERIELS.NOTIF.DELETE_DOC_CONFIRMATION.TITLE"),
      text: this.translate.instant("MATERIELS.NOTIF.DELETE_DOC_CONFIRMATION.LABEL"),
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant("ACTION.CANCEL"),
      confirmButtonText: this.translate.instant("ACTION.VALIDATE"),
    }).then(async response => {
      if (response.value) {
        this.documentService.delete(document_id).toPromise().then(res=>{
          this.getMateriel(this.materiel.id);
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("MATERIELS.NOTIF.DOCUMENT_DELETED.DONE"),
            showConfirmButton: false,
            timer: 1500,  
          })
          this.cdr.markForCheck();
        })
      }
    })
	}
}
