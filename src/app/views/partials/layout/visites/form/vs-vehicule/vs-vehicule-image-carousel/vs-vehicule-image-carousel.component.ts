import { Component, OnInit, Input } from '@angular/core';
import { Document } from '@app/core/models';
import { DocumentService } from '@app/core/services';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'vs-vehicule-image-carousel',
  templateUrl: './vs-vehicule-image-carousel.component.html',
  styleUrls: ['./vs-vehicule-image-carousel.component.scss']
})
export class VsVehiculeImageCarouselComponent implements OnInit {

  @Input() images: Array<Document>;

  imageObject: Array<object> = null;

  constructor(
    private documentService: DocumentService,
    public _sanitizer: DomSanitizer
    ) { }

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
    if(image.extension == 'base64'){
      content = 'data:image/jpg;base64,' + image.canvas;
    }else{
      content = this.documentService.readFile(image.id);
    }
    
    return content;
  }

}
