import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { Materiel } from '@app/core/models';
import { DashboardService } from '@app/core/services';
import * as echarts from 'echarts';


@Component({
  selector: 'tf-dash-materiel',
  templateUrl: './dash-materiel.component.html',
  styleUrls: ['./dash-materiel.component.scss']
})
export class DashMaterielComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  listData : MatTableDataSource<Materiel>;

  stats : any;
  filter: any = {
		keyword: ""
  };
  
  displayedMaterielColumns = [
    'vs_retard',
    'code',
    'libelle',
    'categorie',
    'actual_user',
    'next_visite',
  ]

  constructor(
    private dashboardService: DashboardService,
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
          this.listData = new MatTableDataSource(this.stats.to_visit);
          this.listData.sort = this.sort;

          this.listData.sortingDataAccessor = (item, property) => {
            console.log(item);
            console.log(property);
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
    return '<span class="text-warning">A visiter : </span>&nbsp;<b class="text-primary">'+this.stats.total_to_visit+'</b>'+'<span class="text-danger ml-4">En retard : </span>&nbsp;<b class="text-primary">'+this.stats.total_retard+'</b>'+'<span class="text-danger ml-4">Total : </span>&nbsp;<b class="text-primary">'+this.stats.total_materiel+'</b>';
  }

  viewMateriel(materielId){
    return this.router.navigateByUrl('materiel/detail/'+materielId);
  }

}
