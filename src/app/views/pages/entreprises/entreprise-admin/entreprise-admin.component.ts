import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatHabilitationService, HabilitationService } from '@app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'tf-entreprise-admin',
  templateUrl: './entreprise-admin.component.html',
  styleUrls: ['./entreprise-admin.component.scss']
})
export class EntrepriseAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
