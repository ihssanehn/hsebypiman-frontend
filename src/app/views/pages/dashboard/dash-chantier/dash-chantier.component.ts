import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WidgetIndicatorItemData } from '@app/views/partials/content/widgets/widget-indicator-list/widget-indicator-list.component';
import * as echarts from 'echarts';
import { ChantierService, DashboardService } from '@app/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'tf-dash-chantier',
  templateUrl: './dash-chantier.component.html',
  styleUrls: ['./dash-chantier.component.scss']
})
export class DashChantierComponent implements OnInit {


  chantiers : any;
  stats : any;
  filter: any = {
    keyword: "",
    order_by:'created_at',
    order_way:'desc',
  };
  
  displayedChantierColumns = [
		'number', 'name', 'client', 'ars_count', 'vss_count', 'remontes_count'
	];

  constructor(
    private chantierService: ChantierService,
    private dashboardService: DashboardService,
    protected cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getChantierDash();
  }

  ngAfterViewInit(){
	}

  async getChantierDash() {
		try {
      this.dashboardService.getChantierStats(this.filter).subscribe(res=>{
        this.stats = res.result.data;
        this.cdr.markForCheck;
      })
			this.chantierService.getAll(this.filter).subscribe(res=>{
				this.chantiers = res.result.data;
				this.cdr.markForCheck();
			});
		} catch (error) {
			console.error(error);
    }
  }


	// Au click, défini order by et order way. Si le order_by est déjà actif, toggle du order_way. Sinon, order_way asc par défaut
	setOrder(by) {
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay()
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getChantierDash();
	}

	toggleOrderWay() {
		if (this.filter.order_way == 'asc') {
			this.filter.order_way = 'desc';
		} else {
			this.filter.order_way = 'asc';
		}
	}
	isOrderedBy(by) {
		if (Array.isArray(by)) {
			return JSON.stringify(by) == JSON.stringify(this.filter.order_by)
		} else {
			return by == this.filter.order_by
		}
  }
  
  viewChantier(chantier_id){
    this.router.navigateByUrl('/chantiers/detail'+chantier_id);
  }

	getHeaderStats(){
		return 'En cours :&nbsp;<b class="text-primary">'+ this.stats.total_chantiers_in_progress+' / '+this.stats.total_chantiers+'</b>'
	}
}
