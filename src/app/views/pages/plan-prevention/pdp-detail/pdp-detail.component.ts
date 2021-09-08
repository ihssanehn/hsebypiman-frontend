import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pdp } from '@app/core/models';
import { PdpService } from '@app/core/services';

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
		protected cdr: ChangeDetectorRef
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
			this.pdp = res.result.data;
			//this.parseActionDate(res.result.data, 'EnToFr');
			//this.actionForm.patchValue(res.result.data);
			this.pdpLoaded = true;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

}

