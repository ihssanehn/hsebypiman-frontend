import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as echarts from 'echarts';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonnelService } from '@app/core/services';


@Component({
  selector: 'tf-suivi-salarie-dash',
  templateUrl: './suivi-salarie-dash.component.html',
  styleUrls: ['./suivi-salarie-dash.component.scss']
})
export class SuiviSalarieDashComponent implements OnInit {

  @ViewChild('evolAll', {static: true}) evolAll: ElementRef;
  @ViewChild('hLine', {static: true}) hLine: ElementRef;
  @ViewChild('pieRating', {static: true}) pieRating: ElementRef;

  filter: any = {
		keyword: "",
	};
  showFilters : Boolean = false;
  stats : any;
  noteColors = ['#c83351','#dea342', '#5ac2bd'];

  echartsEvol;
  EvolOptions = {
    title: {
      text: this.translate.instant("SUIVI_HSE.DASH.AVG_SCORE_PER_EMPLOYEE.TITLE"),
      x: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b} : {c}%'
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
      boundaryGap: true,
      axisLabel:
      {
        rotate:50,
        margin: 10
      },
      data: []
    },
    yAxis: {
      name: 'Notes en %',
      type: 'value'
    },
    series: [{
      data: [],
      type: 'bar',
      color: '#33b5ae',
      barCategoryGap: '60%'
    }]
  };

  echartsHLine;
  hLineOptions = {
    title: {
      text: this.translate.instant("SUIVI_HSE.DASH.RATING_PER_TYPE.TITLE"),
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
    color: this.noteColors,
    title: {
      text: this.translate.instant("SUIVI_HSE.DASH.SCORES_BY_EMPLOYEE.TITLE"),
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

  refreshTranslations(){
		this.translate.stream("SUIVI_HSE.DASH.AVG_SCORE_PER_EMPLOYEE.TITLE").subscribe(x =>{
			this.EvolOptions.title.text = x;
			this.echartsEvol.setOption(this.EvolOptions);
		});
		this.translate.stream("SUIVI_HSE.DASH.RATING_PER_TYPE.TITLE").subscribe(x =>{
			this.hLineOptions.title.text = x;
			this.echartsHLine.setOption(this.hLineOptions);
	   });
		this.translate.stream("SUIVI_HSE.DASH.SCORES_BY_EMPLOYEE.TITLE").subscribe(x =>{
			this.byRatingOptions.title.text = x;
			this.echartsRating.setOption(this.byRatingOptions);
		});
	}
  
	ngAfterViewInit(){
    this.echartsRating = echarts.init(this.pieRating.nativeElement)
    this.echartsRating.showLoading();
    
		this.echartsEvol = echarts.init(this.evolAll.nativeElement)
    this.echartsEvol.showLoading();
    
    this.echartsHLine = echarts.init(this.hLine.nativeElement)
    this.echartsHLine.showLoading();
    
    this.refreshTranslations();
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

          if(this.stats.evolution){
            this.stats.evolution.forEach(element => {
              this.EvolOptions.series[0]['data'].push({
                value: element,
                itemStyle: {color: this.setColor(element)}
              });
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

  setColor(note){
    if(note <= 33.33){
      return this.noteColors[0];
    }else{
      if(note <= 66.66){
        return this.noteColors[1];
      }else{
        return this.noteColors[2];
      }
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
