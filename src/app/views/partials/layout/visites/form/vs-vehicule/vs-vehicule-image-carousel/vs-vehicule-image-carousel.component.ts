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
  slideIndex = 0;

  constructor(
    private documentService: DocumentService,
    public _sanitizer: DomSanitizer
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

  handleImageClick(event){
    this.openModal();
    this.currentSlide(event+1);
  }

  openModal() {
    document.getElementById('imgModal').style.display = "block";
  }

  closeModal() {
    document.getElementById('imgModal').style.display = "none";
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(slideIndex);

  showSlides(n) {
   let i;

   const slides = document.getElementsByClassName("img-slides") as HTMLCollectionOf<HTMLElement>;
   const dots = document.getElementsByClassName("images") as HTMLCollectionOf<HTMLElement>;

   if (n > slides.length) {this.slideIndex = 1}
   if (n < 1) {this.slideIndex = slides.length}

   for (i = 0; i < slides.length; i++) {
       slides[i].style.display = "none";
   }
   for (i = 0; i < dots.length; i++) {
       dots[i].className = dots[i].className.replace(" active", "");
   }

   slides[this.slideIndex-1].style.display = "block";

   if (dots && dots.length > 0) {
     dots[this.slideIndex-1].className += " active";
   }
 }



}
