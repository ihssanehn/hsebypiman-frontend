import { Component, Input, OnInit } from '@angular/core';
import { Document } from '@app/core/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowDocumentModalComponent } from '../../modal/show-document-modal/show-document-modal.component';

@Component({
  selector: 'tf-doc-list-tooltip',
  templateUrl: './doc-list-tooltip.component.html',
  styleUrls: ['./doc-list-tooltip.component.scss']
})
export class DocListTooltipComponent implements OnInit {

  @Input() documents: Document[];
  
  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  openDocModal(id: number) {
		var doc = {'id': id, 'extension': 'pdf'};
		const modalRef = this.modalService.open(ShowDocumentModalComponent, {size: 'lg',scrollable: true,centered : true, windowClass:'doc-modal'});
		modalRef.componentInstance.document = doc;
	}

}
