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
  selectedStatusColor: String;

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
    this.types = await this.typeService.getAllFromModel('Chantier').toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getUsers(){
    this.users = await this.authService.getAllUsers().toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getStatus(){
    this.status = await this.statusService.getAllFromModel('Chantier').toPromise();
    if(this.edit){
      this.setSelectedStatus(this.chantierForm.controls['status_id'].value, true);
    }
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  setSelectedStatus(item, init = false){
    let key = init ? item : item.value;
    let selectedStatus = this.status.filter(x => x.id == key)[0];

    this.selectedStatusColor = selectedStatus.color;
    console.log(this.selectedStatusColor);
  }
}
