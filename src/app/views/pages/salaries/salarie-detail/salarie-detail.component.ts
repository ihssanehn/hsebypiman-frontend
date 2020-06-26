import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User } from '@app/core/auth';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/core/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'tf-salarie-detail',
  templateUrl: './salarie-detail.component.html',
  styleUrls: ['./salarie-detail.component.scss']
})
export class SalarieDetailComponent implements OnInit, OnDestroy {

  salarie: User;
	salarieForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	// Private properties
	private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private salarieFB: FormBuilder,
		private userService: UserService,
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
        this.getSalarie(id);

        } else {
          this.router.navigateByUrl('/salaries/list');
        }
      }
    );
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

  async getSalarie(salarieId){
		try {
			var res = await this.userService.getUserById(salarieId).toPromise();
			this.salarie = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }
  
  goBackWithId() {
		const url = `/salaries/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  
  

}
