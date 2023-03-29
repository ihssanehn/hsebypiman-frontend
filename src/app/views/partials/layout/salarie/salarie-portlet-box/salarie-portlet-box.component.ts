import { Component, OnInit, Input } from '@angular/core';
import { CatMetric } from '@app/core/models';

@Component({
  selector: 'tf-salarie-portlet-box',
  templateUrl: './salarie-portlet-box.component.html',
  styleUrls: ['./salarie-portlet-box.component.scss']
})
export class SalariePortletBoxComponent implements OnInit {

  @Input() catMetric: CatMetric;

  constructor() { }

  ngOnInit() {
  }

}
