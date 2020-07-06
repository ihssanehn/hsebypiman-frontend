import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tf-salarie-score',
  templateUrl: './salarie-score.component.html',
  styleUrls: ['./salarie-score.component.scss']
})
export class SalarieScoreComponent implements OnInit {

  @Input() score: number;

  scoreColors = [
    {
      'background': 'rgba(214, 141, 19, 0.8)',
      'border-color': 'rgba(214, 141, 19, 1)'
    },
    {
      'background': 'rgba(186, 0, 38, 0.8)',
      'border-color': 'rgba(186, 0, 38, 1)'
    },
    {
      'background': 'rgba(51, 181, 174, 0.8)',
      'border-color': 'rgba(51, 181, 174, 1)'
    }
  ]


  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  setColor(){
    if(this.score < 50){
      return this.scoreColors[0];
    }else{
      if(this.score < 100){
        return this.scoreColors[1];
      }else{
        return this.scoreColors[2];
      }
    }
  }

}
