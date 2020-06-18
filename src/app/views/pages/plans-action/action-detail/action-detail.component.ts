import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { ActionService, TypeService, UserService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Action } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { User } from '@app/core/auth';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-action-detail',
  templateUrl: './action-detail.component.html',
  styleUrls: ['./action-detail.component.scss']
})
export class ActionDetailComponent implements OnInit, OnDestroy {
  
  	action: Action;
	actionForm: FormGroup;
	formloading: boolean = false;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	editEfficacite: boolean = false;
	editPilote: boolean = false;
	usersList: User[];
	usersLoaded: boolean = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param actionFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private actionFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private actionService: ActionService,
		private userService: UserService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
		private dateFrToEnPipe: DateFrToEnPipe,
		private dateEnToFrPipe: DateEnToFrPipe,
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer
	) {
		iconRegistry.addSvgIcon('status-encours',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/encours.svg'));
		iconRegistry.addSvgIcon('status-termine',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/termine.svg'));
	}

  	ngOnInit() {
		this.createForm();
	  	const routeSubscription = this.activatedRoute.params.subscribe(
		  	async params => {
			  	const id = params.id;
			  	if (id) {
					this.getAction(id);
				} else {
					this.router.navigateByUrl('/plans-action/list');
				}
			}
		);
	}

	createForm() {
		this.actionForm = this.actionFB.group({
			type_id: [null, Validators.required],
			libelle: ['', Validators.required],
			risque: [''],
			objectif: ['', Validators.required],
			pilote_id: [''],
			delai: [''],
			realisation: [''],
			efficacite: [''],
			commentaires: [''],
			status_id: [null],
			visite_type: [null],
			actionable_id: [null],
			actionable_type: [null],
			actionable: [null],
			type: [null],
		});
	}

  	async getAction(actionId){
		try {
			var res = await this.actionService.get(actionId).toPromise();
			this.action = res.result.data;
			this.parseActionDate(res.result.data, 'EnToFr');
			this.actionForm.patchValue(res.result.data);
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async getUsers(){
		this.usersLoaded = false;
		var res = await this.userService.getList().toPromise();
		if(res){
		  this.usersList = res.result.data;
		  this.usersLoaded = true;
		}
		this.cdr.markForCheck();
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	goBackWithId() {
		const url = `/plans-action/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  
	refreshAction(id) {
		this.router.navigateByUrl('/plans-action/edit/'+id);
  	}

	goToActionDetail(id){
		this.router.navigateByUrl('/plans-action/detail/'+id);
	}

	goToVsDetail(id){
		var actionable_type = this.action.actionable_type;
		switch(actionable_type){
			case 'VsChantier': var path = 'chantiers';break;
			case 'VsEpi': var path = 'epis';break;
			case 'VsOutillage': var path = 'outillages';break;
			case 'VsVehicule': var path = 'vehicules';break;
		}
		this.router.navigateByUrl('visites-securite/'+path+'/detail/'+id);
	}

	goToVsChantierDetail(id){
		this.router.navigateByUrl('visites-securite/chantiers/detail/'+id);
	}

  	editAction(id){
		this.router.navigateByUrl('plans-action/edit/'+id);
	}

	deleteAction(id){
		Swal.fire({
			title:'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
            timer: 1500
		})
	}

	closeAction(actionId){
		
		Swal.fire({
			icon: 'warning',
			title: 'Voulez vous vraiment clore cette action ?',
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Clore l\'action'
		}).then(async response => {
			if (response.value) {
				const res = await this.actionService.closeAction(actionId)
				.toPromise()
				.then(res=>{
					var code = res.message.code as SweetAlertIcon;
					var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
					Swal.fire({
						icon: code,
						title: 'l\'action a été clos avec succès',
						showConfirmButton: false,
						html: message,
						timer: code == 'success' ? 1500 : 3000
					}).then(() => {
						this.getAction(actionId);
					})
				}).catch(e => {
					Swal.fire({
						icon: 'error',
						title: 'Echec! une erreur est survenue',
						showConfirmButton: false,
						timer: 1500
					});
				});
			}
		});
	}

	abandonAction(actionId){
		
		Swal.fire({
			icon: 'warning',
			title: 'Voulez vous vraiment abandonner cette action ?',
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Abandonner l\'action'
		}).then(async response => {
			if (response.value) {
				const res = await this.actionService.abandonAction(actionId)
				.toPromise()
				.then(res=>{
					var code = res.message.code as SweetAlertIcon;
					var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
					Swal.fire({
						icon: code,
						title: 'l\'action a été abandonnée avec succès',
						showConfirmButton: false,
						html: message,
						timer: code == 'success' ? 1500 : 3000
					}).then(() => {
						this.getAction(actionId);
					})
				}).catch(e => {
					Swal.fire({
						icon: 'error',
						title: 'Echec! une erreur est survenue',
						showConfirmButton: false,
						timer: 1500
					});
				});
			}
		});
	}

	attributeAction(actionId){
		this.getUsers();
		this.editPilote = true;
		Swal.fire({
			icon: 'warning',
			title: 'Veuillez sélectionner un pilote pour cette action',
			showConfirmButton: false,
			timer: 1500
		});
	}

	async setPilote(piloteId: any){
		console.log(piloteId);
		const res = await this.actionService.attributeAction(this.action.id, piloteId)
			.toPromise()
			.then(res=>{
				var code = res.message.code as SweetAlertIcon;
				var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
				Swal.fire({
					icon: code,
					title: 'l\'action a été attribuée avec succès',
					showConfirmButton: false,
					html: message,
					timer: code == 'success' ? 1500 : 3000
				}).then(() => {
					this.editPilote = false;
					this.getAction(this.action.id);
				})
			}).catch(e => {
				Swal.fire({
					icon: 'error',
					title: 'Echec! une erreur est survenue',
					showConfirmButton: false,
					timer: 1500
				});
			});
	}

	editEffic(){
		this.editEfficacite = true;
	}

	async setEfficacite(efficacite: any){
		if(efficacite){
			console.log(efficacite);
			let form = {...this.actionForm.getRawValue()};
			this.formloading = true;
			this.parseActionDate(form, 'FrToEn');
			form.id = this.action.id;
			form.efficacite = efficacite;

			const res = await this.actionService.update(form)
			.toPromise()
			.then((res) => {
				
				this.formloading = false;
				var code = res.message.code as SweetAlertIcon;
				var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
				Swal.fire({
					icon: code,
					title: 'Action mis à jour avec succès',
					showConfirmButton: false,
					html: message,
					timer: code == 'success' ? 1500 : 3000
				}).then(() => {
					this.editEfficacite = false;
					this.getAction(this.action.id);
				})
				this.cdr.markForCheck();
			})
			.catch(e => {
				Swal.fire({
					icon: 'error',
					title: 'Echec! une erreur est survenue',
					showConfirmButton: false,
					timer: 1500
				});
			});
			this.cdr.markForCheck();
		}
	}

	parseActionDate(item, direction){
		item.delai = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.delai) : this.dateEnToFrPipe.transform(item.delai);
		item.realisation = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.realisation) : this.dateEnToFrPipe.transform(item.realisation);
	}
}
