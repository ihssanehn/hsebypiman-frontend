import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tf-admin-add-modal',
  templateUrl: './admin-add-modal.component.html',
  styleUrls: ['./admin-add-modal.component.scss']
})
export class AdminAddModalComponent implements OnInit {

  title: string = '...';

  label: string = '';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }


  async submit(){
    this.activeModal.close({ libelle : this.label });
  }
}
