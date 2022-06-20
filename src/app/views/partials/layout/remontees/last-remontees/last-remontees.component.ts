import { Component, OnInit, Input, Inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RemonteeService, DocumentService } from '@app/core/services';
import { Remontee } from '@app/core/models';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ImageLightboxContentDialogComponent } from '@app/views/partials/layout/modal/image-lightbox-content-dialog/image-lightbox-content-dialog.component';
import moment from 'moment';



@Component({
  selector: 'tf-last-remontees',
  templateUrl: './last-remontees.component.html',
  styleUrls: ['./last-remontees.component.scss']
})
export class LastRemonteesComponent implements OnInit {

  last_remontees : Remontee[];
  
  constructor(
    private cdr: ChangeDetectorRef,
    private remonteeService:RemonteeService,
    private documentService:DocumentService,
		private router:Router,
		private dialog: MatDialog,

  ) { }


	ngOnInit(){
		this.getLastremontees()
  }
  
	async getLastremontees(){
		var res = await this.remonteeService.getAll({limit:3}).toPromise();
		var _remontees = res.result.data;
		_remontees.forEach(remontee=>{
			remontee.photos = remontee.documents.filter(x => ['jpg','bmp','jpeg','gif','png','tif','heic'].indexOf(x.extension.toLowerCase()) != -1);
			remontee.photos.forEach(x=>{
				x.src = this.documentService.readFile(x.id);
				x.image = this.documentService.readFile(x.id);
				x.thumbImage = this.documentService.readFile(x.id);
			});
		})
		this.last_remontees = _remontees;
    this.cdr.markForCheck();
	}
  
  async getPhoto(remontee){
		await this.documentService.readFile(remontee.photos[0].id);
  }
  
	goToRemontee(remontee_id){
		return this.router.navigateByUrl('/remontees/detail/' + remontee_id);
	}
	
	addNewRemontee(){
		return this.router.navigateByUrl('/remontees/add');
	}
	
  openModal(photos, index) {

    const dialogRef = this.dialog.open(ImageLightboxContentDialogComponent, {
      data: { images : photos, selectedImgIndex: index}
    });
  }
}
