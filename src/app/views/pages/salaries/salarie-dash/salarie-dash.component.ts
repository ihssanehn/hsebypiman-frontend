import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as echarts from 'echarts';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonnelService } from '@app/core/services';

@Component({
  selector: 'tf-salarie-dash',
  templateUrl: './salarie-dash.component.html',
  styleUrls: ['./salarie-dash.component.scss']
})
export class SalarieDashComponent implements OnInit {

  @ViewChild('evolAll', {static: true}) evolAll: ElementRef;
  @ViewChild('hLine', {static: true}) hLine: ElementRef;
  @ViewChild('pieRating', {static: true}) pieRating: ElementRef;

  filter: any = {
		keyword: "",
	};
  showFilters : Boolean = false;
  stats : any;

  echartsEvol;
  EvolOptions = {
    title: {
      text: 'Evolution des objectifs',
      x: 'left'
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      name: 'Salariés',
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      type: 'value'
    },
    legend: {
      data: []
    },
    series: [
    ]
  };

  echartsHLine;
  hLineOptions = {
    title: {
      text: 'Taux des objectifs par type',
      x: 'center'
    },
    dataset: {
        source: [
          ['rating', 'name']
        ]
    },
    grid: {containLabel: true},
    xAxis: {name: '%'},
    yAxis: {type: 'category'},
    visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: 10,
        max: 100,
        text: ['Note élevée', 'Note faible'],
        // Map the score column to color
        dimension: 0,
        inRange: {
            color: ['#c83351','#dea342', '#5ac2bd']
        }
    },
    series: [
        {
            type: 'bar',
            encode: {
                x: 'rating',
                y: 'name'
            }
        }
    ]
  };

  echartsRating;
  byRatingOptions = {
    color: ['#c83351','#dea342', '#5ac2bd'],
    title: {
      text: 'Nombre de salariés',
      x: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      left: 20,
      right: 20,
      bottom: 10,
      series:[]
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        selectedMode: 'single',
        data: []
        }
      ]
  };


  constructor(
    private router: Router,
		private activatedRoute: ActivatedRoute,
		protected salarieService: PersonnelService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private el: ElementRef
  ) { }

	ngOnInit() {
		this.getSalariesDash();
  }
  
	ngAfterViewInit(){
    this.echartsRating = echarts.init(this.pieRating.nativeElement)
    this.echartsRating.showLoading();
    
		this.echartsEvol = echarts.init(this.evolAll.nativeElement)
    this.echartsEvol.showLoading();
    
    this.echartsHLine = echarts.init(this.hLine.nativeElement)
		this.echartsHLine.showLoading();
  }
  
  ngOnDestroy(){
		this.cdr.detach();
	}

  advancedSearchChanged($event){
		this.showFilters = $event;
  }
  
  udpateFilters(filters){
		for (let [key, value] of Object.entries(filters)) {
			this.filter[key] = value;
		}
		this.getSalariesDash();
	}

  async getSalariesDash() {
		try {
			this.salarieService.getStats(this.filter).subscribe(
				res=>{
          this.stats = res.result.data;
          
          this.byRatingOptions.series[0]['data'] = this.stats.rating_per_employee;
					this.echartsRating.setOption(this.byRatingOptions);
					this.echartsRating.hideLoading();

          this.EvolOptions.series = [];
          if(this.stats.evolution){
            this.stats.evolution.forEach(element => {
              this.EvolOptions.series.push({
                type: 'line',
                name: element.name,
                data: element.data
              });
              this.EvolOptions.legend.data.push(element.name);
            });
          }
          this.EvolOptions.xAxis.data = this.stats.evolutionAxis;
          this.echartsEvol.setOption(this.EvolOptions);
          this.echartsEvol.hideLoading();

          this.hLineOptions.dataset.source = [];
          if(this.stats.rating_per_cat){
            this.stats.rating_per_cat.forEach((element,key) => {
              this.hLineOptions.dataset.source.push(
                [element.data,element.name]
              );
            });
          }
          this.echartsHLine.setOption(this.hLineOptions);
					this.echartsHLine.hideLoading();
										
					this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
		}
  }
  
  getClass(sens, value){
		if(value > 0.33 && value < 0.66){
			return 'text-warning';
		}
		switch (sens) {
			case 'up':
				if(value <= 0.33){return 'text-danger'}else{return 'text-success'};
			case 'down':
				if(value <= 0.33){return 'text-success'}else{return 'text-danger'};
		}
	}

}
