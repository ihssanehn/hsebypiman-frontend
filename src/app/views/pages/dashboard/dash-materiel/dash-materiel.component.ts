import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { Materiel } from '@app/core/models';
import { DashboardService } from '@app/core/services';
import * as echarts from 'echarts';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'tf-dash-materiel',
  templateUrl: './dash-materiel.component.html',
  styleUrls: ['./dash-materiel.component.scss']
})
export class DashMaterielComponent implements OnInit {

  @ViewChild('materielSort', {static: false}) set sort(sort: MatSort){
		if(sort){
      this.materielListData.sort = sort;
		}
  };
  
  materielListData : MatTableDataSource<Materiel>;

  stats : any;
  filter: any = {
		keyword: ""
  };
  
  displayedMaterielColumns = ['vs_retard','code','libelle','categorie','actual_user','next_visite',]

  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService,
    private router: Router,
		protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getMaterielDash();
  }

  async getMaterielDash() {
		try {
			this.dashboardService.getMaterielStats(this.filter).subscribe(res=>{
          this.stats = res.result.data;
          this.materielListData = new MatTableDataSource(this.stats.to_visit);
          this.materielListData.sort = this.sort;

          this.materielListData.sortingDataAccessor = (item, property) => {
            switch(property) {
              case 'categorie': return item.main_categorie.libelle;
              case 'actual_user': return item.actual_user ? item.actual_user.prenom : '';
              default: return item[property];
            }
          };
          this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
    }
  }

  getHeaderStats(){
    return '<span>'+this.translate.instant("COMMON.DASH.TO_VISIT")+' : </span>&nbsp;<b class="text-warning">'+this.stats.total_to_visit+'</b>'+'<span class="ml-4">'+this.translate.instant("COMMON.DASH.LATE")+' : </span>&nbsp;<b class="text-danger">'+this.stats.total_retard+'</b>'+'<span class="ml-4">'+this.translate.instant("COMMON.DASH.TOTAL")+' : </span>&nbsp;<b class="text-primary">'+this.stats.total_materiel+'</b>';
  }

  viewMateriel(materielId){
    return this.router.navigateByUrl('materiel/detail/'+materielId);
  }

}
