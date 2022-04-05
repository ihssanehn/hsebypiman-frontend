import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatHabilitationService, HabilitationService } from '@app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'tf-admin-entreprise',
  templateUrl: './admin-entreprise.component.html',
  styleUrls: ['./admin-entreprise.component.scss']
})
export class AdminEntrepriseComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
