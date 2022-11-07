import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService, User } from '@app/core/auth';
import { UserService, CauserieService } from '@app/core/services';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Causerie } from '@app/core/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'tf-participate-causerie-modal',
  templateUrl: './participate-causerie-modal.component.html',
  styleUrls: ['./participate-causerie-modal.component.scss']
})
export class ParticipateCauserieModalComponent implements OnInit {

  user: User;
  causerie: Causerie;
  participationForm: FormGroup;
  retourParticipant: string;

	constructor(
    private cdr: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private authService: AuthService,
    private causerieService: CauserieService,
    private fb:FormBuilder
  ) {
	}

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.participationForm = this.fb.group({
      user_id: [this.user ? this.user.id : null, Validators.required],
      causerie_id: [this.causerie ? this.causerie.id : null, Validators.required],
      feedback_participant: [this.retourParticipant]
    })
  }

  async validate() {
    var form = this.participationForm.getRawValue();
    this.activeModal.close(form);
  }

}
