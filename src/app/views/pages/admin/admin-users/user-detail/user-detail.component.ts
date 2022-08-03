import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, DocumentService } from '@app/core/services';
import { User } from '@app/core/auth/_models/user.model';
import { Remontee } from '@app/core/models';

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
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
    private UserService: UserService,
    private documentService: DocumentService,
		private cdr: ChangeDetectorRef,
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
      if(this.user.photo_profil){
				this.user.photo_profil.src = this.documentService.readFile(this.user.photo_profil.id);
			}
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
