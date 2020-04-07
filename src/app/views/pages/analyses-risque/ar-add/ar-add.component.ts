import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { ArService, TypeService, ChantierService } from '@app/core/services';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Ar, Type, Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'tf-ar-add',
  templateUrl: './ar-add.component.html',
  styleUrls: ['./ar-add.component.scss']
})
export class ArAddComponent implements OnInit {
  
  ar: Ar;
  arForm: FormGroup;
  types: Type[];
  users: User[];
	// allRoles: Role[];
	loaded = false;
  editMode: boolean = false;
  filter = {
    keyword: "",
  }
  public chantiersList : Paginate<Chantier>;
  public chantier : Chantier;
  // Private properties
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private arFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private arService: ArService,
		private typeService: TypeService,
    private authService: AuthService,
    protected chantierService:ChantierService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
    private translate:TranslateService,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) {

    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
   }

  ngOnInit() {
    this.ar = new Ar();
    this.createForm();
    this.getTypes();
    this.getUsers();
    
  }

  async getTypes(){
    this.types = await this.typeService.getAllFromModel('Ar').toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getUsers(){
    this.users = await this.authService.getAllUsers().toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  createForm() {
		this.arForm = this.arFB.group({
      date: [null, Validators.compose([])],
      a_prevoir_compagnons:['', Validators.compose([])],
      date_accueil_secu:[null, Validators.compose([])],
      realisateur:['', Validators.compose([])],
      tel_realisateur:['', Validators.compose([])],
      date_validite:[null, Validators.compose([])],
      num_secours:['', Validators.compose([])],
      contact_interne_secours:[null, Validators.compose([])],
      tel_contact_interne_secours:['', Validators.compose([])],
      contact_client_chef_chtr:['', Validators.compose([])],
      tel_contact_client_chef_chtr:['', Validators.compose([])],
      contact_client_hse:['', Validators.compose([])],
      tel_contact_client_hse:['', Validators.compose([])],
      heure_ouverture:['', Validators.compose([])],
      heure_fermeture:['', Validators.compose([])],
      courant_dispo:['', Validators.compose([])],
		});
		this.loaded = true;
		this.cdr.detectChanges();
  }
  
  searchForChantier(keyword: string){
    this.filter.keyword = keyword;
    console.log(keyword);
    this.getChantier();
    console.log(this.chantiersList);
    console.log(this.chantier);
  }

  async getChantier(){
    try {
      this.chantiersList = await this.chantierService.search(this.filter).toPromise();
      this.chantier = this.chantiersList.data[0];
		} catch (error) {
			console.error(error);
		}
  }

  
  
}
