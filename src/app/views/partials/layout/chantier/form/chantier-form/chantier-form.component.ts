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
    var res = await this.typeService.getAllFromModel('Chantier').toPromise();
    this.types = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getUsers(){
    var res = await this.authService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getStatus(){
    var res = await this.statusService.getAllFromModel('Chantier').toPromise();
    this.status = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
}
