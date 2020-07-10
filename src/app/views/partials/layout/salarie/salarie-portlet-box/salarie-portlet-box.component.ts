import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CatMetric } from '@app/core/models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'tf-salarie-portlet-box',
  templateUrl: './salarie-portlet-box.component.html',
  styleUrls: ['./salarie-portlet-box.component.scss']
})
export class SalariePortletBoxComponent implements OnInit {

  @Input() catMetric: CatMetric;
  @Input() edit: boolean;
  @Input() year: FormControl;
  @Output() onEdit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSubmit(value){
    this.onEdit.emit(value);
  }

}
