import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tf-remontee-detail-modal',
  templateUrl: './remontee-detail-modal.component.html',
  styleUrls: ['./remontee-detail-modal.component.scss']
})
export class RemonteeDetailModalComponent implements OnInit {

  id: number;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
