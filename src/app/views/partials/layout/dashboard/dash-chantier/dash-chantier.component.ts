import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WidgetIndicatorItemData } from '@app/views/partials/content/widgets/widget-indicator-list/widget-indicator-list.component';
import * as echarts from 'echarts';
import { ChantierService, DashboardService } from '@app/core/services';
import { Router } from '@angular/router';
import { Chantier } from '@app/core/models';
import { MatTableDataSource } from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-dash-chantier',
  templateUrl: './dash-chantier.component.html',
  styleUrls: ['./dash-chantier.component.scss']
})
export class DashChantierComponent implements OnInit {

	chantierListData : MatTableDataSource<Chantier>;

	@ViewChild('chantierSort', {static: false}) set sort(sort: MatSort){
		if(sort){
      this.chantierListData.sort = sort;
		}
	};
	
	
  chantiers : Chantier[];
  stats : any;
  filter: any = {
    keyword: "",
    order_by:'created_at',
    order_way:'desc',
  };
  
  displayedChantierColumns = [
		'number', 'nom', 'client', 'ars_count', 'vss_count', 'remontes_count'
	];

  constructor(
    private chantierService: ChantierService,
    private dashboardService: DashboardService,
    private translate: TranslateService,
    protected cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getChantierDash();
  }

  async getChantierDash() {
		try {
      this.dashboardService.getChantierStats(this.filter).subscribe(res=>{
        this.stats = res.result.data;
        this.cdr.markForCheck;
      })
			this.chantierService.getAll(this.filter).subscribe(res=>{
				this.chantiers = res.result.data;
				this.chantierListData = new MatTableDataSource(this.chantiers);
          this.chantierListData.sort = this.sort;

          this.chantierListData.sortingDataAccessor = (item, property) => {
            switch(property) {
							
              default: return item[property];
            }
          };
				this.cdr.markForCheck();
			});
		} catch (error) {
			console.error(error);
    }
  }

  
  viewChantier(chantier_id){
    this.router.navigateByUrl('/chantiers/detail'+chantier_id);
  }

	getHeaderStats(){
		return this.translate.instant("COMMON.DASH.IN_PROGRESS")+' :&nbsp;<b class="text-primary">'+ this.stats.total_chantiers_in_progress+' / '+this.stats.total_chantiers+'</b>'
	}
}
