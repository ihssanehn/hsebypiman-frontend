import { Component, OnInit, Input } from '@angular/core';
import { Type } from '@app/core/models';
import { PersonnelService } from '@app/core/services';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tf-salarie-portlet-row',
  templateUrl: './salarie-portlet-row.component.html',
  styleUrls: ['./salarie-portlet-row.component.scss']
})
export class SalariePortletRowComponent implements OnInit {

  @Input() metric: Type;

  editMode: boolean = false;
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
          this.router.navigateByUrl('/salaries/list');
        }
      }
    );
  }

  editMetric(){
		this.editMode = true;
	}

  async setMetric(metricValue: any){
    if(metricValue){
      console.log(this.personnelId);
      console.log(this.metric.id);
      console.log(metricValue);
      const res = await this.salarieService.setMetric(
        this.personnelId, 
        {
          'metric_id': this.metric.id,
          'value': metricValue
        }
      )
			.toPromise()
			.then(res=>{
				var code = res.message.code as SweetAlertIcon;
				var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
				Swal.fire({
					icon: code,
					title: 'La métrique a été mis à jour avec succès',
					showConfirmButton: false,
					html: message,
					timer: code == 'success' ? 1500 : 3000
				}).then(() => {
          this.editMode = false;
          this.metric.pivot.value = metricValue;
				})
			}).catch(e => {
				Swal.fire({
					icon: 'error',
					title: 'Echec! une erreur est survenue',
					showConfirmButton: false,
					timer: 1500
				});
			});
    }
  }


}
