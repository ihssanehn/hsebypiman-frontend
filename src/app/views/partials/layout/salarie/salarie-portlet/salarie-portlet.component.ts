import { Component, OnInit, Input } from '@angular/core';
import { Type } from '@app/core/models';

@Component({
  selector: 'tf-salarie-portlet',
  templateUrl: './salarie-portlet.component.html',
  styleUrls: ['./salarie-portlet.component.scss']
})
export class SalariePortletComponent implements OnInit {

  @Input() metricsTree: Type;

  constructor() { }

  ngOnInit() {
  }

  calculateGlobalRating(){
    const sum = this.metricsTree.catMetricsList.reduce((acc, cur) => acc + Number(cur.rating),0);
    const avg = (sum / this.metricsTree.catMetricsList.length);
    return avg;
  }

}
