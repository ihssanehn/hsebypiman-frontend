import { Component, OnInit, Input } from '@angular/core';
import { CatMetric } from '@app/core/models';

@Component({
  selector: 'tf-salarie-card',
  templateUrl: './salarie-card.component.html',
  styleUrls: ['./salarie-card.component.scss']
})
export class SalarieCardComponent implements OnInit {

  @Input() catMetric: CatMetric;


  constructor() { }

  ngOnInit() {
  }

  getProgressColor(rating){
    return {
      'danger-progress': rating<=33.33,
      'warning-progress': rating>33.33 && rating<=66.66,
      'success-progress': rating>66.66
    };
  }

}
