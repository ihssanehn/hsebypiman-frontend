import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pdp } from '@app/core/models';
import { PdpService } from '@app/core/services';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-pdp-detail',
  templateUrl: './pdp-detail.component.html',
  styleUrls: ['./pdp-detail.component.scss']
})
export class PdpDetailComponent implements OnInit {

  pdp: Pdp;
  pdpLoaded: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    protected pdpService: PdpService,
    protected cdr: ChangeDetectorRef,
    private dateFrToEnPipe: DateFrToEnPipe,
		private dateEnToFrPipe: DateEnToFrPipe
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
      this.parsePdpDate(res.result.data, 'EnToFr');
      this.pdp = res.result.data;
			this.pdpLoaded = true;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  parsePdpDate(item, direction){
    item.pdp_validations.forEach(validation => {
      validation.validation_at = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(validation.validation_at) : this.dateEnToFrPipe.transform(validation.validation_at);
      validation.part_inspection_at = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(validation.part_inspection_at) : this.dateEnToFrPipe.transform(validation.part_inspection_at);
    });
    item.pdp_intervention_at = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.pdp_intervention_at) : this.dateEnToFrPipe.transform(item.pdp_intervention_at);
	}

}

