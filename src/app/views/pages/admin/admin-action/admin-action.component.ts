import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatHabilitationService, HabilitationService } from '@app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'tf-admin-action',
  templateUrl: './admin-action.component.html',
  styleUrls: ['./admin-action.component.scss']
})
export class AdminActionComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
