import { Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef, ContentChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { ActionService, TypeService, PersonnelService } from '@app/core/services';
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
	loaded = false;
	usersList: User[];
	usersLoaded: boolean = false;
	editMode2C: boolean = false;
	attribMode: boolean = false;
	cloreMode: boolean = false;
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
		private userService: PersonnelService,
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
		this.getUsers();
	  	const routeSubscription = this.activatedRoute.params.subscribe(
		  	async params => {
			  	const id = params.id;
			  	if (id) {
					this.getAction(id);
				} else {
					this.router.navigateByUrl('/plan-actions/list');
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
			date_realisation: [''],
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
		const url = `/plan-actions/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  
	refreshAction(id) {
		this.router.navigateByUrl('/plan-actions/edit/'+id);
  	}

	goToActionDetail(id){
		this.router.navigateByUrl('/plan-actions/detail/'+id);
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
		this.router.navigateByUrl('plan-actions/edit/'+id);
	}

	deleteAction(id){
		Swal.fire({
			title:'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
            timer: 1500
		})
	}

	cloreAction(){
		this.setCloreMode(true);
		Swal.fire({
			icon: 'warning',
			title: 'Veuillez éditer les champs concernant la résolution et l\'efficacité',
			showConfirmButton: false,
			timer: 1500
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

	attributeAction(){
		this.setAttribMode(true);
		Swal.fire({
			icon: 'warning',
			title: 'Veuillez indiquer le pilote et le délai pour cette action',
			showConfirmButton: false,
			timer: 1500
		});
	}

	parseActionDate(item, direction){
		item.delai = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.delai) : this.dateEnToFrPipe.transform(item.delai);
		item.date_realisation = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_realisation) : this.dateEnToFrPipe.transform(item.date_realisation);
	}

	async save(){
		let form = {...this.actionForm.getRawValue()};
		this.formloading = true;
		this.parseActionDate(form, 'FrToEn');
		form.id = this.action.id;

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
				this.close();
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

	close(){
		this.setEditMode2C(false);
		this.setAttribMode(false);
		this.setCloreMode(false);
	}

	setEditMode1C(value: boolean){

	}

	setEditMode2C(value: boolean){
		this.editMode2C = value;
	}

	setAttribMode(value: boolean){
		this.attribMode = value;
	}

	setCloreMode(value: boolean){
		this.cloreMode = value;
	}
	
}
