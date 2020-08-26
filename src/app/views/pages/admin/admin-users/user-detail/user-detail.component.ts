import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/core/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {MatDatepicker} from '@angular/material/datepicker';
import { User } from '@app/core/auth/_models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { SalarieEditComponent } from '../salarie-edit/salarie-edit.component';

@Component({
  selector: 'tf-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  user: User;
	userForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	// Private properties
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private salarieFB: FormBuilder,
    private UserService: UserService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.getUser(id);
        } else {
          this.router.navigateByUrl('/admin/users/list');
        }
      }
    );
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

  async getUser(userId){
		try {
      var res = await this.UserService.getUserById(userId).toPromise();
			this.user = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }
  

	editUser(){
		this.router.navigateByUrl('/admin/users/edit/'+this.user.id);
  }
	giveAccess(){
		this.router.navigateByUrl('/admin/users/edit/'+this.user.id);
  }

  goBack() {
		this.router.navigateByUrl('/admin/users/list');
  }

}
