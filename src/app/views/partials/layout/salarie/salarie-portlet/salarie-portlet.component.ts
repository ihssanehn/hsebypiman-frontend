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

}
