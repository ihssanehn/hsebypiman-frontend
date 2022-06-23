import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { QcmSession } from '@app/core/models';
import { QcmSessionService } from '@app/core/services';

@Component({
  selector: 'tf-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  success: boolean = false;
  score: number;
  question_count: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private qcmSessionService: QcmSessionService,
    private iconRegistry: MatIconRegistry, 
		private sanitizer: DomSanitizer
  ) { 
    this.iconRegistry.addSvgIcon('picto-medaille',this.sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-medaille.svg'));
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.getQuizz(id);
        } else {
          this.router.navigateByUrl('/quizz/home');
        }
      }
    );
  }

  getQuizz(id: number) {
    this.qcmSessionService.get(id).toPromise().then((res) => {
      var qcmSession = res.result.data;
      this.score = qcmSession.score;
      this.question_count = qcmSession.question_count;
      this.success = qcmSession.is_success;
      this.cdr.detectChanges();
    });
  }

}
