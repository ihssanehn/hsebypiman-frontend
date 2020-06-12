import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { TypeService } from '@app/core/services';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'tf-vs-vehicule-form-img',
  templateUrl: './vs-vehicule-form-img.component.html',
  styleUrls: ['./vs-vehicule-form-img.component.scss']
})
export class VsVehiculeFormImgComponent implements OnInit, AfterViewInit {

  @Input() visiteForm: FormGroup;
  @Input() origin: string;

  @ViewChild('img_canvas', null) signaturePad: SignaturePad;
  @ViewChild('imgCanvasContainer', null) imgCanvasContainer: ElementRef;

  private canvas: Object = {
    'minWidth': 0.5,
    'canvasWidth': 800,
    'canvasHeight': 400
  }
  public signaturePadOptions: Object = { 
    'minWidth': this.canvas['minWidth'],
    'canvasWidth': this.canvas['canvasWidth'],
    'canvasHeight': this.canvas['canvasHeight'],
    'penColor': 'red',
    'backgroundColor': 'rgb(255, 255, 255)'
  };

  constructor(
    private typeService: TypeService,
    private cdr: ChangeDetectorRef,
    public _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if(this.origin == 'add'){
      var width = this.imgCanvasContainer.nativeElement.offsetWidth - 1;
      if(this.signaturePad){this.signaturePad.set('canvasWidth', width)};
      this.getVehiculeImgToDisplay();
    }
  }

  resizeSignaturePad() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signaturePad.set('canvasWidth', this.canvas['canvasWidth'] / ratio);
  }

  drawComplete() {
    this.visiteForm.get('img_canvas')
      .setValue(this.signaturePad.toDataURL());
  }

  showSignature(){
    return this.visiteForm.get('img_canvas').value 
      ? this.visiteForm.get('img_canvas').value 
      : false
  }

  clearSignature() {
    this.signaturePad.clear();
    this.getVehiculeImgToDisplay();
    this.visiteForm.get('img_canvas').reset();
  }

  async getVehiculeImgToDisplay(){
    var type_id = this.visiteForm.get('type_id').value;

    await this.typeService.get(type_id).pipe(
      tap(res=>{
        var type = res;
        if(type.code == "VEH_UTILITAIRE"){
          this.signaturePad.fromDataURL('assets/media/images/veh_utilitaire.jpg');
        }else{
          this.signaturePad.fromDataURL('assets/media/images/veh_berline.jpg');
        }
      })
    ).subscribe(res => {
      this.cdr.markForCheck();
    });

    
  }

}
