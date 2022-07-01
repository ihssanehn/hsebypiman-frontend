import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/core/services';
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
	editMode: boolean = false;
  remontees = [];
	// Private properties
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
    private UserService: UserService,
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

      // TODO -> UPDATE WITH BACKEND

      this.remontees = [
        {
          "id": 3,
          "description": "sdfghj",
          "type_id": 59,
          "is_approved": 1,
          "actions": null,
          "is_victims": 0,
          "facts": null,
          "event_type_id": 69,
          "event_location_type_id": 65,
          "event_place": null,
          "event_date": "2022-06-29",
          "creator_id": 1,
          "created_at": "2022-06-29T11:25:48.000000Z",
          "documents_count": 3,
          "status": "A attribuer",
          "status_color": "#55cec7",
          "publication_status": "Publiée",
          "action_status": "A attribuer",
          "creator": {
            "id": 1,
            "nom": "Admin",
            "prenom": "Admin",
            "trigramme": null,
            "fullname": "Admin Admin"
          },
          "type": {
            "id": 59,
            "libelle": "Incidente",
            "code": "INCIDENT",
            "bg_color": null,
            "icon": "http://localhost:8000/storage/types/icons/fr/default.png",
            "color": null,
            "model": "Remontee",
            "ordre": 3,
            "active": 1,
            "creator_id": 1
          },
          "action": {
            "id": 1,
            "actionable_id": 3,
            "actionable_type": "App\\Models\\Remontee",
            "type_id": 39,
            "risque": null,
            "libelle": "Admin Admin - Incidente",
            "objectif": null,
            "pilote_id": null,
            "delai": null,
            "status_id": 9,
            "date_realisation": null,
            "efficacite": null,
            "commentaires": null,
            "creator_id": 1,
            "created_at": "2022-07-01T08:12:07.000000Z",
            "updated_at": "2022-07-01T08:12:07.000000Z",
            "status": {
              "id": 9,
              "libelle": "A attribuer",
              "code": "A_ATTRIBUER",
              "color": "#55cec7",
              "model": "Action",
              "ordre": 1,
              "active": 1,
              "creator_id": 1
            }
          }
        },
        {
          "id": 2,
          "description": "sdfghjkl:=",
          "type_id": 59,
          "is_approved": 1,
          "actions": null,
          "is_victims": 0,
          "facts": null,
          "event_type_id": 69,
          "event_location_type_id": 65,
          "event_place": null,
          "event_date": "2022-06-29",
          "creator_id": 1,
          "created_at": "2022-06-29T10:19:10.000000Z",
          "documents_count": 0,
          "status": "Publiée",
          "status_color": "#55cec7",
          "publication_status": "Publiée",
          "action_status": null,
          "creator": {
            "id": 1,
            "nom": "Admin",
            "prenom": "Admin",
            "trigramme": null,
            "fullname": "Admin Admin"
          },
          "type": {
            "id": 59,
            "libelle": "Incidente",
            "code": "INCIDENT",
            "bg_color": null,
            "icon": "http://localhost:8000/storage/types/icons/fr/default.png",
            "color": null,
            "model": "Remontee",
            "ordre": 3,
            "active": 1,
            "creator_id": 1
          },
          "action": null
        },
        {
          "id": 1,
          "description": "azerghjk",
          "type_id": 60,
          "is_approved": 1,
          "actions": null,
          "is_victims": 0,
          "facts": null,
          "event_type_id": null,
          "event_location_type_id": null,
          "event_place": null,
          "event_date": "2022-06-29",
          "creator_id": 1,
          "created_at": "2022-06-29T10:17:13.000000Z",
          "documents_count": 0,
          "status": "Publiée",
          "status_color": "#55cec7",
          "publication_status": "Publiée",
          "action_status": null,
          "creator": {
            "id": 1,
            "nom": "Admin",
            "prenom": "Admin",
            "trigramme": null,
            "fullname": "Admin Admin"
          },
          "type": {
            "id": 60,
            "libelle": "Échapée belle",
            "code": "ECHAPEE",
            "bg_color": null,
            "icon": "http://localhost:8000/storage/types/icons/fr/1651131056.png",
            "color": null,
            "model": "Remontee",
            "ordre": 3,
            "active": 1,
            "creator_id": 1
          },
          "action": null
        }
      ]

      

      // UNTODO

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
