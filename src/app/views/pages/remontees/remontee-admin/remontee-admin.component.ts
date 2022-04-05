import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatHabilitationService, HabilitationService } from '@app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'tf-remontee-admin',
  templateUrl: './remontee-admin.component.html',
  styleUrls: ['./remontee-admin.component.scss']
})
export class RemonteeAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
