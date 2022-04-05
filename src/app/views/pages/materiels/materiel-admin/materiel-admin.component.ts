import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatHabilitationService, HabilitationService } from '@app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'tf-materiel-admin',
  templateUrl: './materiel-admin.component.html',
  styleUrls: ['./materiel-admin.component.scss']
})
export class MaterielAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
