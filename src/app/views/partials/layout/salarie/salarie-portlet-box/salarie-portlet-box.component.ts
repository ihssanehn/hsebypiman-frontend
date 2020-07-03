import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CatQuestion } from '@app/core/models';

@Component({
  selector: 'tf-salarie-portlet-box',
  templateUrl: './salarie-portlet-box.component.html',
  styleUrls: ['./salarie-portlet-box.component.scss']
})
export class SalariePortletBoxComponent implements OnInit {

  @Input() catMetric: CatQuestion;
  @Output() onEdit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSubmit(value){
    this.onEdit.emit(value);
  }

}
