
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Type, Status } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { TypeService, StatusService } from '@app/core/services';
import { first } from 'rxjs/operators';


@Component({
  selector: 'tf-chantier-form',
  templateUrl: './chantier-form.component.html',
  styleUrls: ['./chantier-form.component.scss']
})
export class ChantierFormComponent implements OnInit {

  types: Type[];
  users: User[];
  status: Status[];

  @Input() chantierForm: FormGroup;
  @Input() edit: Boolean;
  constructor(
    private typeService:TypeService,
    private statusService:StatusService,
    private authService:AuthService,
		private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTypes();
    this.getUsers();
    this.getStatus();
  }

  async getTypes(){
    this.types = await this.typeService.getAllFromModel('Vs').toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getUsers(){
    this.users = await this.authService.getAllUsers().toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getStatus(){
    this.status = await this.statusService.getAllFromModel('Vs').toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
}
