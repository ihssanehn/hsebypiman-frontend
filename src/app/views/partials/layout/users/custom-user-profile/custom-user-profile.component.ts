import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '@app/core/auth/_models/user.model';


@Component({
  selector: 'tf-custom-user-profile',
  templateUrl: './custom-user-profile.component.html',
  styleUrls: ['./custom-user-profile.component.scss']
})

export class CustomUserProfileComponent implements OnInit{

  @Input() user : User;
  @Input() source;
  @Output() onEditUser = new EventEmitter();
  @Output() onGoBack = new EventEmitter();
  @Output() onGiveAccess = new EventEmitter();

  constructor(
  ) { }


  ngOnInit(){
  }

  editUser(){
    this.onEditUser.emit('go');
  }

  goBack(){
    this.onGoBack.emit('go')
  }

  giveAccess(){
    this.onGiveAccess.emit('go')
  }
}
