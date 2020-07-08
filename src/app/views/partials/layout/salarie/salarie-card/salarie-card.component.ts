import { Component, OnInit, Input } from '@angular/core';
import { CatQuestion } from '@app/core/models';

@Component({
  selector: 'tf-salarie-card',
  templateUrl: './salarie-card.component.html',
  styleUrls: ['./salarie-card.component.scss']
})
export class SalarieCardComponent implements OnInit {

  @Input() catMetric: CatQuestion;


  constructor() { }

  ngOnInit() {
  }

  getProgressColor(score){
    return {
      'danger-progress': score<=33,
      'warning-progress': score>33 && score<=66,
      'success-progress': score>66
    };
  }

}
