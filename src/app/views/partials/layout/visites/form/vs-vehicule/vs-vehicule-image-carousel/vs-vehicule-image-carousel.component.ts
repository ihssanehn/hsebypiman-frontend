import { Component, OnInit, Input } from '@angular/core';
import { Document } from '@app/core/models';
import { DocumentService } from '@app/core/services';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { ImageLightboxContentDialogComponent } from '@app/views/partials/layout/modal/image-lightbox-content-dialog/image-lightbox-content-dialog.component';

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
    public _sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadImages();
  }

  loadImages(){
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

  openModal(index: number) {
    const dialogRef = this.dialog.open(ImageLightboxContentDialogComponent, {
      data: { images : this.imageObject, selectedImgIndex: index}
    });
  }
  
}
