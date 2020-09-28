import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Comment} from '@app/core/models';
import { CommentsAddComponent } from '../comments-add/comments-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tf-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent implements OnInit {

  @Input() comments: Comment[];
  @Output() onAddComment = new EventEmitter();

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  addComment(){
    const modalRef = this.modalService.open(CommentsAddComponent, {size: 'lg',scrollable: true,centered : true});
    modalRef.result.then((result) => {
      if (result) {
        this.onAddComment.emit(result)
      }
    }, (reason) => {
      
    });
  }

}
