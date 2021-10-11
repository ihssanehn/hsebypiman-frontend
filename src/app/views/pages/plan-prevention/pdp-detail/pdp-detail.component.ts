import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Pdp } from '@app/core/models';
import { DocumentService, PdpService } from '@app/core/services';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import { SafePipe } from '@app/core/_base/layout';

import moment from 'moment';

@Component({
  selector: 'tf-pdp-detail',
  templateUrl: './pdp-detail.component.html',
  styleUrls: ['./pdp-detail.component.scss']
})
export class PdpDetailComponent implements OnInit {

  pdp: Pdp;
  pdpLoaded: boolean = false;
  pdpPiman: boolean ;

  sousTraitantEeColumns: string[] = ['name', 'mail', 'tel'];
  pdpConsigneeColumns: string[] = ['instructions', 'answer', 'comments', 'operation_type'];
  pdpEpiDispositioneeColumns: string[] = ['ppe', 'answer', 'filter', 'type', 'comment'];
  pdpMoyenDispositionEeColumns: string[] = ['moyen_disposition', 'answer', 'comment'];
  pdpTravauxDangereuxColumns: string[] = ['pdp_travaux_dangereux', 'answer'];
  pdpValidationsColumns: string[] = ['company', 'fullname', 'date', 'participation', 'visa'];
  intervenantsColumns: string[] = ['lastname', 'firstname', 'phone', 'training_auth', 'medical_follow_up', 'visa'];

  isExpanded : boolean = true;
  isDisableToggle : boolean = false;
  validationEditMode : boolean = false;
  intervenantEditMode : boolean = false;


  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected pdpService: PdpService,
    protected cdr: ChangeDetectorRef,
    protected _sanitizer: DomSanitizer,
	private documentService : DocumentService,
  ) { }

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
        this.getPdp(id);
        if(this.pdpLoaded){

        }
      } else {
        this.router.navigateByUrl('/plan-de-prevention/list');
      }
    }
  );
  }

  async getPdp(pdpId) {
		try {
			var res = await this.pdpService.get(pdpId).toPromise();
      		this.parsePdpDate(res.result.data);
	  		var pdp = res.result.data;
			this.pdpPiman = !(pdp.type.code == "PDP_CLIENT");
	  		pdp.documents = pdp.documents.filter(x => ['pdf'].indexOf(x.extension.toLowerCase()) != -1);
	  		pdp.documents.forEach(x=>{
				x.src = this.documentService.readFile(x.id);
				x.image = this.documentService.readFile(x.id);
				x.thumbImage = this.documentService.readFile(x.id);
			});
	  		console.log(pdp.documents)
      		this.pdp = pdp;

			this.pdpLoaded = true;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  parsePdpDate(item){
    item.pdp_validations.forEach(validation => {
      validation.validation_at = moment(validation.validation_at, 'DD-MM-YYYY').format('YYYY-MM-DD');
      validation.part_inspection_at = moment(validation.part_inspection_at, 'DD-MM-YYYY').format('YYYY-MM-DD');
    });
    item.pdp_intervention_at = moment(item.pdp_intervention_at, 'DD-MM-YYYY').format('YYYY-MM-DD');
  }

  showValidationSignatureForm(){
    this.validationEditMode = true;
  }

  cancelValidationSignature(){
    this.validationEditMode = false;
  }

  showIntervenantSignatureFrom(){
    this.intervenantEditMode = true;
  }

  cancelIntervenantSignature(){
    this.intervenantEditMode = false;
  }

  onSignPDP($event) {
    this.intervenantEditMode = this.validationEditMode = false;
    this.getPdp(this.pdp.id);
  }
}

