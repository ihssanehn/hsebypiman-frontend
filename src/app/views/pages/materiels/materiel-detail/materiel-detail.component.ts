import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

import { MaterielService,  DocumentService } from '@app/core/services';
import { Materiel, Document } from '@app/core/models';
import {PretModalComponent, ImageLightboxContentDialogComponent, RevisionModalComponent} from '@app/views/partials/layout';
import {MatDialog} from '@angular/material/dialog';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'tf-materiel-detail',
  templateUrl: './materiel-detail.component.html',
  styleUrls: ['./materiel-detail.component.scss']
})
export class MaterielDetailComponent implements OnInit, OnDestroy {
  
  	materiel: Materiel;
	materielForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	selectedUserId: number;
	
	// Private properties
	private subscriptions: Subscription[] = [];

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
		iconRegistry: MatIconRegistry, 
		private _sanitizer: DomSanitizer,
	) {
		// iconRegistry.addSvgIcon('status-encours',_sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/encours.svg'));
		// iconRegistry.addSvgIcon('status-termine',_sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/termine.svg'));
	}

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

	// goToVsDetail(visiteId){
	// 	var cat = this.materiel.main_categorie.libelle.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	// 	var url = '/visites-securite/'+cat+'s/detail/'+visiteId
	// 	this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	// }

	goToUserDetail(id){
		// let url = this.router.url;
		// url = `/salaries/detail/${id}`;
		// this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
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

	// openDocsModal(visite){
	// 	var images = [ ...visite.photos];
	// 	if(visite.img_canvas){
	// 		var doc = new Document();
	// 		doc.canvas = visite.img_canvas;
	// 		doc.extension = 'base64';
	// 		images.unshift(doc);
	// 	}

	// 	let imageObject = images.map(element => this.mapImages(element));

	// 	const dialogRef = this.dialog.open(ImageLightboxContentDialogComponent, {
	// 	  data: { images : imageObject, selectedImgIndex: 0}
	// 	});

	// }
	
	mapImages(image: any){
    var temp = [];
    temp['image'] = this.getImageContent(image);
    temp['thumbImage'] = this.getImageContent(image);
    return temp;
  }
	getImageContent(image: any){
    var content;
    if(image.extension == 'base64'){
      content = this._sanitizer.bypassSecurityTrustResourceUrl(image.canvas);
    }else{
      content = this.documentService.readFile(image.id);
    }
    
    return content;
  }

	async updatePret(params){
		try {
			var res = await this.materielService.updatePret(this.materiel.id, params).toPromise();
			this.materiel = res.result.data;
			this.cdr.markForCheck();
			Swal.fire({
				icon: 'success',
				title: this.translate.instant("MATERIELS.NOTIF.LOAN_UPDATED.TITLE"),
				showConfirmButton: false,
				timer: 1500
			});
		} catch (error) {
			console.error(error);
		}
	}

	async assignUser(params){
		try {
			var res = await this.materielService.createPret(this.materiel.id, params).toPromise();
			this.materiel = res.result.data;
			this.cdr.markForCheck();
			Swal.fire({
				icon: 'success',
				title: this.translate.instant("MATERIELS.NOTIF.LOAN_CREATED.TITLE"),
				showConfirmButton: false,
				timer: 1500
			});
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
}
