import { Component, OnInit, Input } from '@angular/core';
import { Metric } from '@app/core/models';
import { PersonnelService } from '@app/core/services';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'tf-salarie-portlet-row',
  templateUrl: './salarie-portlet-row.component.html',
  styleUrls: ['./salarie-portlet-row.component.scss']
})
export class SalariePortletRowComponent implements OnInit {

  @Input() metric: Metric;

  personnelId: number;

  constructor(
    private salarieService: PersonnelService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.personnelId = id;
        }else{
          //this.router.navigateByUrl('/salaries/list');
        }
      }
    );
  }

}
