import { Component, OnInit, Input } from '@angular/core';
import { User } from '@app/core/auth';

@Component({
  selector: 'tf-salarie-portlet',
  templateUrl: './salarie-portlet.component.html',
  styleUrls: ['./salarie-portlet.component.scss']
})
export class SalariePortletComponent implements OnInit {

  @Input() salarie: User;

  constructor() { }

  ngOnInit() {
  }

}
