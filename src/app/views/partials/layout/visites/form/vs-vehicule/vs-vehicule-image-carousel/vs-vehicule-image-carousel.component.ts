import { Component, OnInit, Input } from '@angular/core';
import { Document } from '@app/core/models';

@Component({
  selector: 'vs-vehicule-image-carousel',
  templateUrl: './vs-vehicule-image-carousel.component.html',
  styleUrls: ['./vs-vehicule-image-carousel.component.scss']
})
export class VsVehiculeImageCarouselComponent implements OnInit {

  @Input() images: Array<Document>;

  imageObject: Array<object> = [
    {
      image: "",
      thumbImage: ""
    }
  ];

  constructor() { }

  ngOnInit() {
    this.imageObject = this.images.map(function(element){
      var temp = [];
      temp['image'] = 'data:image/jpg;base64,'+element.canvas;
      temp['thumbImage'] = 'data:image/jpg;base64,'+element.canvas;
      return temp;
    });
  }

  getImageContent(image: any){
    return 'data:image/jpg;base64,' + image.canvas;
  }

}
