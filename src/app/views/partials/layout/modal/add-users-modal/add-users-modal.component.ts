import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@app/core/services';
import { User } from '@app/core/auth';

@Component({
  selector: 'tf-add-users-modal',
  templateUrl: './add-users-modal.component.html',
  styleUrls: ['./add-users-modal.component.scss']
})
export class AddUsersModalComponent implements OnInit {

  users_already_subscribed: User[];
  usersList: User[] = [];
  usersToAdd = [];

  constructor(
    public userService: UserService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  async getUsers(){
    await this.userService.getList().toPromise().then(res=>{
      this.usersList = res.result.data.filter(x=> !this.users_already_subscribed.map(x=>x.id).includes(x.id) );
      this.cdr.markForCheck();
    })
  }

  addUsers(){
    this.activeModal.close(this.usersToAdd);
  }
  
}
