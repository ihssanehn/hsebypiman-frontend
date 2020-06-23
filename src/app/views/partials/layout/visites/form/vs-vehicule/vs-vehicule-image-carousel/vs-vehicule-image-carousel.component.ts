import { Component, OnInit, Input } from '@angular/core';
import { Document } from '@app/core/models';

@Component({
  selector: 'vs-vehicule-image-carousel',
  templateUrl: './vs-vehicule-image-carousel.component.html',
  styleUrls: ['./vs-vehicule-image-carousel.component.scss']
})
export class VsVehiculeImageCarouselComponent implements OnInit {

  @Input() images: Array<Document>;

  imageObject: Array<object> = null;

  constructor() { }

  ngOnInit() {
    this.imageObject = this.images.map(element => this.mapImages(element));
  }

  mapImages(image: any){
    var temp = [];
    temp['image'] = this.getImageContent(image);
    temp['thumbImage'] = this.getImageContent(image);
    return temp;
  }

  getImageContent(image: any){
    var content;
    switch(image.extension){
      case 'base64': 
        content = 'data:image/jpg;base64,' + image.canvas;
        break;
    }
    return content;
  }

}
