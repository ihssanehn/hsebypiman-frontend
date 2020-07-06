import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterielService, TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Materiel } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import {PretModalComponent} from '@app/views/partials/layout';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';

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
	displayedEEChantiersColumns: Array<any>;
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
		private materielFB: FormBuilder,
		private modalService: NgbModal,
		public dialog: MatDialog,
		// private notificationService: NzNotificationService,
		private materielService: MaterielService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer
	) {
		iconRegistry.addSvgIcon('status-encours',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/encours.svg'));
		iconRegistry.addSvgIcon('status-termine',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/termine.svg'));
	}

  	ngOnInit() {
	  	const routeSubscription = this.activatedRoute.params.subscribe(
		  	async params => {
			  	const id = params.id;
			  	if (id) {
					this.getMateriel(id);

				} else {
					this.router.navigateByUrl('/materiels/list');
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
		const url = `/materiels/list`;
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
		url = `/materiels/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  	}

	goToUserDetail(id){
		// let url = this.router.url;
		// url = `/salaries/detail/${id}`;
		// this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
		Swal.fire({
			title:'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
            timer: 1500
		})
	}

  	editMateriel(id){
		this.router.navigateByUrl('materiels/edit/'+id);
	}
	deleteMateriel(id){
		Swal.fire({
			title:'Désolé cette fonctionnalité n\'a pas encore été implémentée',
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
			this.materiel = res.result.data;
			this.cdr.markForCheck();
			Swal.fire({
				icon: 'success',
				title: 'Prêt mis à jour avec succès',
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
				title: 'Prêt créé avec succès',
				showConfirmButton: false,
				timer: 1500
			});
		} catch (error) {
			console.error(error);
		}
	}

}
