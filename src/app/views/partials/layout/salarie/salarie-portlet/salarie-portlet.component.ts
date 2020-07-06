import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Type } from '@app/core/models';

@Component({
  selector: 'tf-salarie-portlet',
  templateUrl: './salarie-portlet.component.html',
  styleUrls: ['./salarie-portlet.component.scss']
})
export class SalariePortletComponent implements OnInit {

  @Input() metricsTree: Type;
  @Output() onEdit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSubmit(value){
    this.onEdit.emit(value);
  }

}
