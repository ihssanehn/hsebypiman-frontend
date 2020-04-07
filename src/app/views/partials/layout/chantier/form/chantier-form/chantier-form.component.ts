import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Type } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { TypeService } from '@app/core/services';


@Component({
  selector: 'tf-chantier-form',
  templateUrl: './chantier-form.component.html',
  styleUrls: ['./chantier-form.component.scss']
})
export class ChantierFormComponent implements OnInit {

  types: Type[];
  users: User[];

  @Input() chantierForm: FormBuilder;
  @Input() edit: Boolean;
  constructor(
    private typeService:TypeService,
    private authService:AuthService,
		private cdr: ChangeDetectorRef,
  ) { }
  ngOnInit() {
    this.getTypes();
    this.getUsers();
  }

  async getTypes(){
    this.types = await this.typeService.getAllFromModel('Chantier').toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getUsers(){
    this.users = await this.authService.getAllUsers().toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
}
