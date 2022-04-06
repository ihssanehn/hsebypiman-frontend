import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, ElementRef, ViewChild,  } from '@angular/core';
import {Comment} from '@app/core/models';
import { CommentsAddComponent } from '../comments-add/comments-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '@app/core/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'tf-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent implements OnInit, AfterViewChecked {

  @Input() comments: Comment[];
  @Output() onAddComment = new EventEmitter();
  
  @ViewChild('scrollMe', {static: true}) private myScrollContainer: ElementRef;

  user: User;
  commentForm: FormGroup;

  formloading: boolean = false;
  loaded = false;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authService : AuthService
  ) { 
		this.authService.currentUser.subscribe(x=> this.user = x);
  }

  ngOnInit() {
    this.createForm();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  createForm() {
    this.commentForm = this.fb.group({
      comment: [null, Validators.required]
    })

		this.loaded = true;
  }

  onSubmit(){
    let form = {...this.commentForm.getRawValue()};
    this.onAddComment.emit(form.comment);
    this.createForm();
  }

  authIsCreator(comment){
    return comment.creator_id == this.user.id;
  }

}
