import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@app/core/services';
import { User } from '@app/core/auth';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectOptionModel } from '@app/core/_base/layout';

@Component({
  selector: 'tf-add-users-modal',
  templateUrl: './add-users-modal.component.html',
  styleUrls: ['./add-users-modal.component.scss']
})
export class AddUsersModalComponent implements OnInit {

  users_already_subscribed: User[];
  usersList: SelectOptionModel[] = [];
  form: FormGroup;

  constructor(
    public userService: UserService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.getUsers();
    this.form = this.formBuilder.group({
      usersToAdd: [[]]
    })
  }

  async getUsers(){
    await this.userService.getList().toPromise().then(res=>{
      this.usersList = res.result.data.filter(x=> !this.users_already_subscribed.map(x=>x.id).includes(x.id) ).map(user=> new SelectOptionModel(user.id, user.fullname));
      this.cdr.markForCheck();
    })
  }

  addUsers(){
    this.activeModal.close(this.form.get('usersToAdd').value);
  }
  
}
