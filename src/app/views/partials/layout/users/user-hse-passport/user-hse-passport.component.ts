import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonnelService, PeriodService, DocumentService, UserService, RemonteeService, MaterielService, CauserieService, ModuleService } from '@app/core/services';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Personnel, FollowUpPeriod, QcmSession, Remontee, Causerie, Formation, Materiel, Revue } from '@app/core/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@app/core/auth';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { EditAccueilSecuModalComponent } from '@app/views/partials/layout/users/edit-accueil-secu-modal/edit-accueil-secu-modal.component';
import { AssignEpiModalComponent, AssignFormationModalComponent } from '@app/views/partials/layout';
import { UploadDelSignatureDocModalComponent } from '../../modal/upload-del-signature-doc-modal/upload-del-signature-doc-modal.component';

@Component({
  selector: 'tf-user-hse-passport',
  templateUrl: './user-hse-passport.component.html',
  styleUrls: ['./user-hse-passport.component.scss']
})
export class UserHsePassportComponent implements OnInit {

  @Input() userId: number;
  @Input() source: string;

  user: User;
	userForm: FormGroup;
	loaded = false;
  SECU_DONE_ICON = "./assets/media/hse-svg/secu_done.svg";
  SECU_UNDONE_ICON = "./assets/media/hse-svg/secu_undone.svg";
  FILE_ICON = "./assets/media/hse-svg/picto-file.svg";

  qcmSession: QcmSession;
  remontees: Remontee[] = [];
  epis: Materiel[] = [];
  formations: Formation[] = [];
  causeries_animees: Causerie[] = [];
  causeries_participees: Causerie[] = [];
  revues: Revue[] = [];


  accueilSecuStatusIcon: String = this.SECU_UNDONE_ICON;
  quizSecuStatusIcon: String = this.SECU_UNDONE_ICON;
  livretSecuStatusIcon: String = this.SECU_UNDONE_ICON;

	formStatus = new FormStatus();
  formDocloading: boolean = false;
	errors: any;

  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
    private userService: UserService,
    private modalService: NgbModal,
    private documentService: DocumentService,
    private causerieService: CauserieService,
    private remonteeService: RemonteeService,
    private materielService: MaterielService,
    private moduleService: ModuleService,
		private cdr: ChangeDetectorRef,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    if(this.userId) {
      this.getUser(this.userId);
    }
  }

  async getUser(user_id){
		await this.userService.getUserById(user_id).toPromise().then(res=>{
			this.user = res.result.data;
			if(this.user.photo_profil){
				this.user.photo_profil.src = this.documentService.readFile(this.user.photo_profil.id);
			}
      this.getUserRemontees();
      this.getUserPretEpi();
      this.getUserFormations();
      this.getUserCauseries();
      this.getUserRevues();
  
      this.resetAccueilSecuStatusIcon();
      this.resetLivretSecuStatusIcon();
      this.resetQuizSecuStatusIcon();
			this.cdr.markForCheck();
		});
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

    this.cdr.markForCheck();
	}
	async getUserCauseries() {
		var res = await this.causerieService.getAll({organisateur_id: this.user.id, pagninate:false}).toPromise();
    this.causeries_animees = res.result.data;
    var res2 = await this.causerieService.getAll({participant_id: this.user.id, pagninate:false}).toPromise();
    this.causeries_participees = res2.result.data;
    this.cdr.markForCheck();
	}
  async getUserRevues(){
    var res = await this.userService.getRevues(this.user).toPromise();
    this.revues = res.result.data;
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

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


  goToRemonteeDetail(id){
		this.router.navigateByUrl('remontees/detail/'+id);
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
      'materiel_label': epi.categorie.libelle + " " + epi.numero_serie,
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
  goToCauserieDetail(id){
		this.router.navigateByUrl('causeries/detail/'+id);
  }
  
  isActiveModule(modules){
    return this.moduleService.isActived(modules);
  }

  showDelSignationDoc() {
    if(this.user.delegation_signature_doc) {
      var url = this.documentService.readFile(this.user.delegation_signature_doc.id);
      window.open(url, '_blank');
    }
  }

  downloadDelSignationDoc() {
    if(this.user.delegation_signature_doc) {
      return this.documentService.downloadFile(this.user.delegation_signature_doc.id);
    }
  }

  uploadDelSignationDoc() {
    const modalRef = this.modalService.open(UploadDelSignatureDocModalComponent, {size: 'md',scrollable: true,centered : true});
    modalRef.componentInstance.userId = this.user.id;
		modalRef.result.then(res => {
      if(res){
        this.reloadUser();
        Swal.fire({
          icon: 'success',
          title: "Le document a bien été enregistré.",
          showConfirmButton: false,
          timer: 1500,
            
        })
      }
    });
  }
  goToDetailRevue(revue_id){
    return this.router.navigateByUrl(`/visites-securite/revues/detail/${revue_id}`)
  }
  getMoyenneRevue(){
    return this.revues.reduce((acc, obj)=> acc + obj.note, 0) / this.revues.length
  }
}
