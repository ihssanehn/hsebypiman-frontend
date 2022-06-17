import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QcmSession } from '@app/core/models';
import { QcmSessionService } from '@app/core/services';

@Component({
  selector: 'tf-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  currentQcmSession: QcmSession;
  chapter: any;
  counter: number = 1;


  constructor(
    private qcmSessionService: QcmSessionService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentQcmSession = this.qcmSessionService.currentQcmSession;

    this.activatedRoute.params.subscribe(
      async params => {
        const idQcmSession = params.id;
        const idChapter = params.idChapter;
        if (idQcmSession && idChapter) {
          if(!this.currentQcmSession) {
            this.getQuizz(idQcmSession, idChapter);
          } else {
            this.chapter = this.qcmSessionService.getChapterQuestions(idChapter);
            console.log(this.chapter);
          }
          
        } else {
          this.router.navigateByUrl('/quizz/home');
        }
      }
    );
  }

  getQuizz(id: number, idChapter: number) {
    this.qcmSessionService.get(id).toPromise().then((res) => {
      var qcmSession = res.result.data;
      this.qcmSessionService.currentQcmSession = qcmSession;
      this.currentQcmSession = qcmSession;
      this.chapter = this.qcmSessionService.getChapterQuestions(idChapter);
      console.log(this.chapter);
      this.cdr.detectChanges();
    });
  }

}
