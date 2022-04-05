import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'tf-image-lightbox-content-dialog',
  templateUrl: './image-lightbox-content-dialog.component.html',
  styleUrls: ['./image-lightbox-content-dialog.component.scss']
})
export class ImageLightboxContentDialogComponent implements OnInit{

  slideIndex = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImageLightboxContentDialogComponent>
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    console.log(this.data);
    this.currentSlide(this.data.selectedImgIndex+1);
  }

  closeModal(){
    document.getElementById('imgModal').style.display = "none";
    this.dialogRef.close();
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
