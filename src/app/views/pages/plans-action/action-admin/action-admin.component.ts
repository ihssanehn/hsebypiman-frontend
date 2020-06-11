import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatHabilitationService, HabilitationService } from '@app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'tf-action-admin',
  templateUrl: './action-admin.component.html',
  styleUrls: ['./action-admin.component.scss']
})
export class ActionAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
