import { Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef, ContentChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { ActionService, TypeService, PersonnelService, VisiteVehiculeService, VisiteOutillageService, VisiteEpiService, VisiteChantierService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Type, Action, Visite } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { User } from '@app/core/auth';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'tf-action-detail',
  templateUrl: './action-detail.component.html',
  styleUrls: ['./action-detail.component.scss']
})
export class ActionDetailComponent implements OnInit, OnDestroy {
  
	action: Action;
	actionLoaded: boolean = false;
	actionForm: FormGroup;
	formloading: boolean = false;
	loaded = false;
	usersList: User[];
	usersLoaded: boolean = false;
	origineMode: boolean = false;
	infosMode: boolean = false;
	attribMode: boolean = false;
	resoMode: boolean = false;
	efficMode: boolean = false;
	typesList: Type[];
	typesLoaded: boolean = false;
	typeSelected: Type;
	private subscriptions: Subscription[] = [];

	visiteTypesList = [
		{ key: 'VsChantier',  value: 'Visite Chantier'},
		{ key: 'VsEpi',       value: 'Visite EPI'},
		{ key: 'VsOutillage', value: 'Visite Outillage'},
		{ key: 'VsVehicule',  value: 'Visite Véhicule'}
	];
	visiteTypesSelected: String;
	visiteTypesLoaded: boolean = false;

	visitesList : Array<Visite>;
	visitesLoaded: boolean = false;
	filteredVisites: Observable<Array<Visite>>;


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
		private typeService: TypeService,
		private actionService: ActionService,
		private userService: PersonnelService,
		private visiteChantierService:VisiteChantierService,
		private visiteEpiService:VisiteEpiService,
		private visiteOutillageService:VisiteOutillageService,
		private visiteVehiculeService:VisiteVehiculeService,
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
		this.getTypes();
		this.getUsers();
	  	const routeSubscription = this.activatedRoute.params.subscribe(
		  	async params => {
			  	const id = params.id;
			  	if (id) {
					this.getAction(id);
					if(this.actionLoaded){
						this.typeSelected = this.actionForm.get('type').value;
						var key = this.actionForm.get('actionable_type').value;
						if(key){
						  var visiteType = this.visiteTypesList.find(item => item.key === key);
						  if(visiteType){
							this.actionForm.get('visite_type').setValue(visiteType);
							this.getVisites(visiteType.key);
						  }
						}
					}
				} else {
					this.router.navigateByUrl('/plan-actions/list');
				}
			}
		);
		this.setDynamicActionType();
		this.setDynamicVisiteType();
		this.initFilteredVisites();
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

	async getTypes(){
		this.typesLoaded = false;
		var res = await this.typeService.getAllFromModel('Action').toPromise();
		if(res){
		  this.typesList = res.result.data;
		  this.typesLoaded = true;
		}
		this.cdr.markForCheck();
	}

  	async getAction(actionId){
		try {
			var res = await this.actionService.get(actionId).toPromise();
			this.action = res.result.data;
			this.parseActionDate(res.result.data, 'EnToFr');
			this.actionForm.patchValue(res.result.data);
			this.actionLoaded = true;
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

	selectedTypeHasCode(){
		if(!this.typesLoaded || !this.typeSelected){
		  return false;
		}
		return this.typeSelected.code
	}

	setDynamicActionType(){
		this.actionForm.get('type_id').valueChanges.subscribe(type_id => {
		  this.actionForm.get('visite_type').setValue(null);
		  if (type_id != null){
			var typeSelected = this.typesList.filter(x=> x.id == type_id)[0];
			if(typeSelected.code == 'VISITE_SECURITE'){
			  this.actionForm.get('visite_type').setValidators(Validators.required);
			}else{
			  this.actionForm.get('visite_type').setValidators(null);
			}
			this.typeSelected = typeSelected;
		  }else{
			this.typeSelected = null;
			this.actionForm.get('visite_type').setValidators(null);
		  }
	
		  this.actionForm.get('visite_type').updateValueAndValidity();
		})
	}

	setDynamicVisiteType(){
		this.actionForm.get('visite_type').valueChanges.subscribe(visite_type => {
		  this.actionForm.get('actionable').setValue(null);
		  if (visite_type != null){
			this.actionForm.get('actionable').setValidators(Validators.required);
			var visiteTypesSelected = visite_type;
	
			this.getVisites(visiteTypesSelected.key);
	
			this.visiteTypesSelected = visiteTypesSelected;
		  }else{
			this.visiteTypesSelected = null;
			this.actionForm.get('actionable').setValidators(null);
		  }
	
		  this.actionForm.get('actionable').updateValueAndValidity();
		})
	}

	getVisites(code){
		this.visitesList = null;
		switch(code){
		  case 'VsChantier':
			this.getVisitesChantier();
			break;
		  case 'VsEpi':
			this.getVisitesEpi();
			break;
		  case 'VsOutillage':
			this.getVisitesOutillage();
			break;
		  case 'VsVehicule':
			this.getVisitesVehicule();
			break;
		}
	}

	async getVisitesChantier(){
		this.visitesLoaded = false;
		var res = await this.visiteChantierService.getList().toPromise();
		if(res){
		  this.visitesList = res.result.data;
		  this.visitesLoaded = true;
		}
		this.cdr.markForCheck();
	}
	
	async getVisitesEpi(){
		this.visitesLoaded = false;
		var res = await this.visiteEpiService.getList().toPromise();
		if(res){
		  this.visitesList = res.result.data;
		  this.visitesLoaded = true;
		}
		this.cdr.markForCheck();
	}
	
	async getVisitesOutillage(){
		this.visitesLoaded = false;
		var res = await this.visiteOutillageService.getList().toPromise();
		if(res){
		  this.visitesList = res.result.data;
		  this.visitesLoaded = true;
		}
		this.cdr.markForCheck();
	}
	
	async getVisitesVehicule(){
		this.visitesLoaded = false;
		var res = await this.visiteVehiculeService.getList().toPromise();
		if(res){
		  this.visitesList = res.result.data;
		  this.visitesLoaded = true;
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
	}

	parseActionDate(item, direction){
		item.delai = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.delai) : this.dateEnToFrPipe.transform(item.delai);
		item.date_realisation = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_realisation) : this.dateEnToFrPipe.transform(item.date_realisation);
	}

	async save(from: string){
		let form = {...this.actionForm.getRawValue()};
		this.formloading = true;
		this.parseActionDate(form, 'FrToEn');
		form.id = this.action.id;
		if(from == 'origine'){
			form.actionable_id = form.actionable ? form.actionable.id : null;
    		form.actionable_type = form.visite_type ? form.visite_type.key : form.actionable_type; 
		}
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
				this.close(from);
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

	close(from: string){
		switch(from){
			case 'attribution': this.setAttribMode(false);break;
			case 'resolution': this.setResoMode(false);break;
			case 'efficacite': this.setEfficMode(false);break;
			case 'origine': this.setOrigineMode(false);break;
			case 'infos': this.setInfosMode(false);break;
		}
	}

	setOrigineMode(value: boolean){
		this.origineMode = value;
	}

	setInfosMode(value: boolean){
		this.infosMode = value;
	}

	setAttribMode(value: boolean){
		this.attribMode = value;
	}

	setCloreMode(value: boolean){
		this.setResoMode(value);
		this.setEfficMode(value);
	}

	setResoMode(value: boolean){
		this.resoMode = value;
	}

	setEfficMode(value: boolean){
		this.efficMode = value;
	}

	displayFn(visite: Visite): String {
		return visite ? visite.code : '';
	}

	async initFilteredVisites(){
		this.filteredVisites = this.actionForm.get('actionable').valueChanges.pipe(
		  startWith(''),
		  map(value => this._filter(value))
		);
	}

	private _filter(value: string): Array<Visite> {
		const filterValue = value;
		return this.visitesList 
		  ? this.visitesList.filter(visite => this._normalizeValue(visite.code).includes(filterValue)) 
		  : null;
	}

	private _normalizeValue(value: String): string {
    	return value.toLowerCase().replace(/\s/g, '');
  	}
	
}
