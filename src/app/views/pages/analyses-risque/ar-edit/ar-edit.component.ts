import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { ArService, TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Ar } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'tf-ar-edit',
  templateUrl: './ar-edit.component.html',
  styleUrls: ['./ar-edit.component.scss']
})
export class ArEditComponent implements OnInit, OnDestroy {
  
  	ar: Ar;
	arForm: FormGroup;
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
	 * @param arFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private arFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private arService: ArService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService
	) { }

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.ar = await this.arService
						.get(id)
						.toPromise();
					this.createForm();

				} else {
					this.ar = new Ar();
					// this.Ar.clear();
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
		const url = `/ars/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  
  	createForm() {
		this.arForm = this.arFB.group({
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
	refreshAr(id) {
		let url = this.router.url;
		url = `/analyses-risque/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  
}
