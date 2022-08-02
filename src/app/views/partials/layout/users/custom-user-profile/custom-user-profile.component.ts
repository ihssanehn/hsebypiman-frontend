import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { User } from '@app/core/auth/_models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from "ng2-file-upload";
import { AddPhotoProfilModalComponent } from '../add-photo-profil-modal/add-photo-profil-modal.component';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';
import { UserService, DocumentService, RemonteeService, QcmSessionService, FormationService, MaterielService } from '@app/core/services';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { Formation, QcmSession, Remontee } from '@app/core/models';
import { Router } from '@angular/router';
import { AssignFormationModalComponent } from '../assign-formation-modal/assign-formation-modal.component';
import { AssignEpiModalComponent } from '../assign-epi-modal/assign-epi-modal.component';
import { EditAccueilSecuModalComponent } from '../edit-accueil-secu-modal/edit-accueil-secu-modal.component';



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

  SECU_DONE_ICON = "./assets/media/hse-svg/secu_done.svg";
  SECU_UNDONE_ICON = "./assets/media/hse-svg/secu_undone.svg";

  qcmSession: QcmSession;
  remontees: Remontee[];
  causeries: Remontee[];
  epis: any[];
  formations: Formation[];

  accueilSecuStatusIcon: String = this.SECU_UNDONE_ICON;
  quizSecuStatusIcon: String = this.SECU_UNDONE_ICON;
  livretSecuStatusIcon: String = this.SECU_UNDONE_ICON;

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
    private remonteeService: RemonteeService,
    private formationService: FormationService,
    private materielService: MaterielService,
    private router: Router
  ) {
  }

	ngOnInit() {
	  this.getUserRemontees();
    this.getUserPretEpi();
    this.getUserFormations();

    this.resetAccueilSecuStatusIcon();
    this.resetLivretSecuStatusIcon();
    this.resetQuizSecuStatusIcon();
  }

  resetAccueilSecuStatusIcon() {
    if(this.user) {
      if(this.user.date_realisation_accueil_secu) {
        this.accueilSecuStatusIcon = this.SECU_DONE_ICON
      } else {
        this.accueilSecuStatusIcon = this.SECU_UNDONE_ICON
      }
    }
  }

  resetLivretSecuStatusIcon() {
    if(this.user) {
      if(this.user.date_realisation_livret_accueil) {
        this.livretSecuStatusIcon = this.SECU_DONE_ICON
      } else {
        this.livretSecuStatusIcon = this.SECU_UNDONE_ICON
      }
    }
  }

  resetQuizSecuStatusIcon() {
    if(this.user) {
      if(this.user.is_quiz_approved) {
        this.quizSecuStatusIcon = this.SECU_DONE_ICON
      } else {
        this.quizSecuStatusIcon = this.SECU_UNDONE_ICON
      }
    }
  }
  
	async getUserRemontees() {
		var res = await this.remonteeService.getAll({creator_id: this.user.id}).toPromise();
    var remontees = res.result.data;
		this.remontees = remontees.filter(remontee => remontee.type && remontee.type.code != 'CAUSERIE');
		this.causeries = remontees.filter(remontee => remontee.type && remontee.type.code == 'CAUSERIE');

    this.cdr.markForCheck();
	}

  async getUserPretEpi() {
		var res = await this.userService.getPretEpi(this.user).toPromise();
		this.epis = res.result.data;

    this.cdr.markForCheck();
	}

  async getUserFormations() {
		var res = await this.userService.getFormations(this.user).toPromise();
		this.formations = res.result.data;

    this.cdr.markForCheck();
	}


  editUser(){
    this.onEditUser.emit('go');
  }

  goBack(){
    this.onGoBack.emit('go')
  }

  goToRemonteeDetail(id){
		this.router.navigateByUrl('remontees/detail/'+id);
	}

  giveAccess(){
    this.onGiveAccess.emit('go')
  }

  showAssignFormationModal() {
    const modalRef = this.modalService.open(AssignFormationModalComponent, {size: 'md',scrollable: true,centered : true});
    modalRef.componentInstance.user_id = this.user.id
		modalRef.result.then(form => {
      if(form){
        this.getUserFormations();
      }
    });
  }

  showAssignEpiModal() {
    const modalRef = this.modalService.open(AssignEpiModalComponent, {size: 'md',scrollable: true,centered : true});
    modalRef.componentInstance.editMode = false;
		modalRef.result.then(form => {
      if(form){
        this.assignNewEpi(
          form.materiel_id, 
          form.date_pret, 
          form.date_retour
        )
      }
    });
  }

  showEditAssignedEpiModal(epi) {
    const modalRef = this.modalService.open(AssignEpiModalComponent, {size: 'md',scrollable: true,centered : true});
    modalRef.componentInstance.editMode = true;
    modalRef.componentInstance.pret = {
      'materiel_id': epi.id,
      'materiel_label': epi.categorie.libelle + " " + epi.code,
      'date_pret': epi.pivot.date_pret,
      'date_retour': epi.pivot.date_retour
    };
		modalRef.result.then(form => {
      if(form){
        this.updateAssignedEpi(
          form.materiel_id, 
          form.date_pret, 
          form.date_retour
        )
      }
    });
  }

  async updateAssignedEpi(epi_id: number, date_pret, date_retour) {
    var params = {
      'salarie_id': this.user.id,
      'date_pret': date_pret,
      'date_retour': date_retour
    }

    var res = await this.materielService.updatePret(epi_id, params).toPromise();
    if(res) {
      this.getUserPretEpi();
    }
    this.cdr.markForCheck();
  }

  async assignNewEpi(epi_id: number, date_pret: Date, date_retour: Date) {
    var params = {
      'salarie_id': this.user.id,
      'date_pret': date_pret,
      'date_retour': date_retour
    }

    var res = await this.materielService.createPret(epi_id, params).toPromise();
    if(res) {
      this.getUserPretEpi();
    }
    this.cdr.markForCheck();
  }

  updatePhotoProfil(){
		const modalRef = this.modalService.open(AddPhotoProfilModalComponent, {size: 'lg',scrollable: true,centered : true});
		modalRef.componentInstance.uploader = this.uploader;
		modalRef.result.then( payload => {
      if(payload){
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

  async reloadUser() {
    var res = await this.userService.getUserById(this.user.id).toPromise();
    if(res) {
      this.user = res.result.data;
      if(this.user.photo_profil){
        this.user.photo_profil.src = this.documentService.readFile(this.user.photo_profil_id);
      }
      this.resetAccueilSecuStatusIcon();
      this.resetLivretSecuStatusIcon();
      this.resetQuizSecuStatusIcon();
    }
    this.cdr.markForCheck();
  }

  retakeTheQuiz() {
    Swal.fire({
      icon: 'warning',
      title: this.translate.instant("USERS.NOTIF.QUIZ_RETAKE_CONFIRMATION.TITLE"),
      text: this.translate.instant("USERS.NOTIF.QUIZ_RETAKE_CONFIRMATION.LABEL"),
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant("ACTION.CANCEL"),
      confirmButtonText: this.translate.instant("ACTION.VALIDATE"),
    }).then(async response => {
      if (response.value) {
        this.userService.requestToRetakeQuiz(this.user.id).toPromise().then(res=>{
          this.reloadUser();
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("USERS.NOTIF.QUIZ_RETAKE_CONFIRMATION.DONE"),
            showConfirmButton: false,
            timer: 1500,  
          })
          this.cdr.markForCheck();
        })
      }
    })
  }

  showEditAccueilSecuModal() {
    const modalRef = this.modalService.open(EditAccueilSecuModalComponent, {size: 'md',scrollable: true,centered : true});
		modalRef.result.then(form => {
      if(form){
        this.validateAccueilSecu(form.date_realisation)
      }
    });
  }

  async validateAccueilSecu(date_realisation) {
    var params = {
      'date_realisation_accueil_secu': date_realisation
    }

    var res = await this.userService.validateAccueilSecu(this.user.id, params).toPromise();
    if(res) {
      this.reloadUser();
      Swal.fire({
        icon: 'success',
        title: "L'accueil sécurité a bien été enregistrée.",
        showConfirmButton: false,
        timer: 1500,
          
      })
    }
    this.cdr.markForCheck();
  }


  async retakeLivretAccueil() {


    Swal.fire({
      icon: 'warning',
      title: this.translate.instant("USERS.NOTIF.LIVRET_RETAKE_CONFIRMATION.TITLE"),
      text: this.translate.instant("USERS.NOTIF.LIVRET_RETAKE_CONFIRMATION.LABEL"),
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant("ACTION.CANCEL"),
      confirmButtonText: this.translate.instant("ACTION.VALIDATE"),
    }).then(async response => {
      if (response.value) {
        this.userService.requestToRetakeLivretAccueil(this.user.id).toPromise().then(res=>{
          this.reloadUser();
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("USERS.NOTIF.LIVRET_RETAKE_CONFIRMATION.DONE"),
            showConfirmButton: false,
            timer: 1500,  
          })
          this.cdr.markForCheck();
        })
      }
    })
  }

}
