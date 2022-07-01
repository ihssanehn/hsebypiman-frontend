import { Component, Input, OnInit, ChangeDetectorRef, Output } from '@angular/core';
import { DocumentService } from '@app/core/services';
import { EventEmitter } from 'events';

@Component({
  selector: 'tf-question-slide',
  templateUrl: './question-slide.component.html',
  styleUrls: ['./question-slide.component.scss']
})
export class QuestionSlideComponent implements OnInit {

  @Input() question: any;
  @Input() chapterTitle: string;
  @Input() currentIndex: number;
  @Input() totalQuestions: number;
  // @Output() answerd = new EventEmitter();

  constructor(
    private documentService:DocumentService,
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit() {
    if(this.question)
    this.question.responses.map(res => {
      var answer = this.question.answers.find(answer => answer.response_id === res.id);
      res.isSelected = answer? true: false;
    })
  }

  selectAnswer(response: any) {
    this.question.responses.forEach(x=>x.isSelected = x.id == response.id);
    // this.answerd.emit('done');
  }

  retrieveResponseImg(response){
    return this.documentService.getFileByPath(response.img_path)
  }
}
