import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tf-quiz-modal',
  templateUrl: './quiz-modal.component.html',
  styleUrls: ['./quiz-modal.component.scss']
})
export class QuizModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private iconRegistry: MatIconRegistry, 
		private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon('picto-secu-mixte',this.sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-secu-mixte.svg'));
    this.iconRegistry.addSvgIcon('picto-care',this.sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-care.svg'));
    this.iconRegistry.addSvgIcon('picto-feuille',this.sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-feuille.svg'));
  }

  ngOnInit() {
  }

  closeModal(){
    this.activeModal.close();
  }

  goToQuiz() {
    this.closeModal();
    this.router.navigateByUrl('/quizz');
  }

}
