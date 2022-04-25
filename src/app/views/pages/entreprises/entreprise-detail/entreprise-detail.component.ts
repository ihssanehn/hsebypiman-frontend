import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

import { EntrepriseService } from '@app/core/services';
import { Entreprise } from '@app/core/models';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-entreprise-detail',
  templateUrl: './entreprise-detail.component.html',
  styleUrls: ['./entreprise-detail.component.scss']
})
export class EntrepriseDetailComponent implements OnInit, OnDestroy {
  
  	entreprise: Entreprise;
	entrepriseForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	displayedEEChantiersColumns: Array<any>;
	displayedEEInterimairesColumns: Array<any>
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param entrepriseFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private translate: TranslateService,
		private entrepriseService: EntrepriseService,
		private cdr: ChangeDetectorRef,
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
					this.getEntreprise(id);

				} else {
					this.router.navigateByUrl('/entreprises/list');
				}
			}
		);
	}

  	async getEntreprise(entrepriseId){
		try {
			var res = await this.entrepriseService.get(entrepriseId).toPromise();
			this.entreprise = res.result.data;
			if(this.entreprise.type.code == 'INTERIM'){
				this.displayedEEChantiersColumns = [
					'number', 'name', 'client', 'status', 'charge_affaire', 
					'date_demarrage', 'date_demarrage_ee', 'interimaire'
				];
				this.displayedEEInterimairesColumns = [
					'prenom',
					'nom',
					'email',
					'chantiers',
					'access',
				];
				this.cdr.markForCheck();

			}else{
				this.displayedEEChantiersColumns = [
					'number', 'name', 'client', 'status', 'charge_affaire', 
					'date_demarrage', 'date_demarrage_ee', 'ca_ee'
				];
				this.cdr.markForCheck();

			}
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
		const url = `/entreprises/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

  	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshEntreprise(id) {
		let url = this.router.url;
		url = `/entreprises/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  	}

	goToChantierDetail(id){
		let url = this.router.url;
		url = `/chantiers/detail/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

  	editEntreprise(id){
		this.router.navigateByUrl('entreprises/edit/'+id);
	}
	deleteEntreprise(id){
		if(this.entreprise.chantiers.length > 0){
			Swal.fire({
				title: this.translate.instant("EES.NOTIF.EE_NOT_DELETED.LABEL"),
				showConfirmButton: false,
				timer: 1500
			})
		}else{
			this.entrepriseService.delete(id).toPromise().then(resp=>{
				Swal.fire({ icon: 'success', 
            title:this.translate.instant("EES.NOTIF.EE_DELETED.LABEL"), 
            showConfirmButton: false,
            timer: 1500 
          })
				this.goBackWithId();
			})
		}
	}
	viewChantier(chantierId) {
		this.router.navigateByUrl('chantiers/detail/' + chantierId);
	}
	makeAccount(interimaire){
			if(interimaire.has_profile){
				
				this.router.navigateByUrl('/admin/users/edit/' + interimaire.has_profile);
			}else{
				// let route = this.router.config.find(r => r.path === 'admin/users/add');
				// console.log(this.router)
				// route.data = { interimaire: interimaire };
				this.router.navigateByUrl('/admin/users/add', {state:{interimaire:interimaire}});
			}
	}

}
