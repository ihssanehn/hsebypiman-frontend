import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

import { CauserieService } from '@app/core/services';
import { Causerie } from '@app/core/models';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, User } from '@app/core/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParticipateCauserieModalComponent } from '@app/views/partials/layout/modal/participate-causerie-modal/participate-causerie-modal.component';

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
		'email',
		'retour_participant'
	];
	// Private properties
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
			this.causerie = res.result.data;
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
		return this.causerie.participants.find(x=>x.id == this.authUser.id)
	}

	participate(){
		const modalRef = this.modalService.open(ParticipateCauserieModalComponent, {size: 'xl',scrollable: true, centered : true});
		modalRef.componentInstance.causerie = this.causerie;
		modalRef.componentInstance.user = this.authUser;
		modalRef.result.then(()=>{
			this.getCauserie();
		})
	}

}
