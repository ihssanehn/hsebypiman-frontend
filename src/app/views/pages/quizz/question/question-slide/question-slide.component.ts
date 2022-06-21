import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    if(this.question)
    this.question.responses.map(res => {
      var answer = this.question.answers.find(answer => answer.response_id === res.id);
      res.isSelected = answer? true: false;
    })
  }

  selectAnswer(response: any) {
    response.isSelected = !response.isSelected;
  }
}
