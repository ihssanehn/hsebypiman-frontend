import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { ChantierService, TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'tf-chantier-edit',
  templateUrl: './chantier-edit.component.html',
  styleUrls: ['./chantier-edit.component.scss']
})
export class ChantierEditComponent implements OnInit, OnDestroy {
  
  chantier: Chantier;
	chantierForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param chantierFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private chantierFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private chantierService: ChantierService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService
	) { }

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.chantier = await this.chantierService
						.get(id)
						.toPromise();
					this.createForm();

				} else {
					this.chantier = new Chantier();
					// this.chantier.clear();
					this.createForm();
				}
			}
    );
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/chantiers/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  
  	createForm() {
		this.chantierForm = this.chantierFB.group({
			nom: [this.chantier.nom, Validators.required],
		});
		this.loaded = true;
		this.cdr.detectChanges();
	}

  	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshChantier(id) {
		let url = this.router.url;
		url = `/chantiers/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  
}
