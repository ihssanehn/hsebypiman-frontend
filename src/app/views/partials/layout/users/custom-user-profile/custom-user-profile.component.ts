import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { User } from '@app/core/auth/_models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from "ng2-file-upload";
import { AddPhotoProfilModalComponent } from '../add-photo-profil-modal/add-photo-profil-modal.component';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';
import { UserService, DocumentService } from '@app/core/services';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';



@Component({
  selector: 'tf-custom-user-profile',
  templateUrl: './custom-user-profile.component.html',
  styleUrls: ['./custom-user-profile.component.scss']
})

export class CustomUserProfileComponent implements OnInit{

  @Input() user : User;
  @Input() source;
  @Output() onEditUser = new EventEmitter();
  @Output() onGoBack = new EventEmitter();
  @Output() onGiveAccess = new EventEmitter();

	formStatus = new FormStatus();
  formDocloading: boolean = false;
	errors: any;
  public uploader:FileUploader = new FileUploader({
    isHTML5: true
  });

  constructor(
    private modalService:NgbModal,
    private translate: TranslateService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private documentService: DocumentService,
  ) { }


  ngOnInit(){
  }

  editUser(){
    this.onEditUser.emit('go');
  }

  goBack(){
    this.onGoBack.emit('go')
  }

  giveAccess(){
    this.onGiveAccess.emit('go')
  }

  updatePhotoProfil(){
		const modalRef = this.modalService.open(AddPhotoProfilModalComponent, {size: 'lg',scrollable: true,centered : true});
		modalRef.componentInstance.uploader = this.uploader;
		modalRef.result.then( payload => {
      if(payload){
        console.log(payload);
        this.saveDocument(payload)
      }
    });
  }

  saveDocument(payloads){

		this.formDocloading = true;
		let formData = new FormData();
		this.formStatus.onFormSubmitting();

    let fileItem = this.uploader.queue[0]._file;
    formData.append('photo_profil', fileItem);

		this.userService.addPhotoProfile(this.user.id, formData)
			.toPromise()
			.then((res) => {
				this.formDocloading = false;
				this.errors = false; 
        this.user = res.result.data
        this.user.photo_profil.src = this.documentService.readFile(this.user.photo_profil_id);
        this.cdr.markForCheck()       
				
				Swal.fire({
					icon: 'success',
					title: this.translate.instant("USERS.NOTIF.PHOTO_PROFIL_UPDATED.TITLE"),
					showConfirmButton: false,
					timer: 1500,
						
				}).then(() => {
					this.uploader.clearQueue();
				});
			})
			.catch(err =>{ 
				this.formDocloading = false;

				Swal.fire({
					icon: 'error',
					title: this.translate.instant("NOTIF.INCOMPLETE_FORM.TITLE"),
					showConfirmButton: false,
					timer: 1500
				});

				if(err.status === 422){
					var messages = extractErrorMessagesFromErrorResponse(err);
					this.formStatus.onFormSubmitResponse({success: false, messages: messages});
					this.cdr.markForCheck();
				}

			});
			
      this.cdr.markForCheck();
    }

    showPhotoProfil(){

    }
}
