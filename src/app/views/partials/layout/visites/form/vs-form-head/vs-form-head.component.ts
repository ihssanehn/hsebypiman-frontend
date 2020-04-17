
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Type, Status } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { TypeService, StatusService } from '@app/core/services';
import { first } from 'rxjs/operators';


@Component({
  selector: 'tf-vs-form-head',
  templateUrl: './vs-form-head.component.html',
  styleUrls: ['./vs-form-head.component.scss']
})
export class VsFormHeadComponent implements OnInit {

  types: Type[];
  users: User[];
  status: Status[];

  @Input() visiteForm: FormGroup;
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
    this.users = await this.authService.getList().toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getStatus(){
    this.status = await this.statusService.getAllFromModel('Vs').toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
}
