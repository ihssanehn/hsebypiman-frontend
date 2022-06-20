import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QcmSession } from '@app/core/models';
import { QcmSessionService } from '@app/core/services';

@Component({
  selector: 'tf-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit {

  currentQcmSession: QcmSession;
  chapters: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private qcmSessionService: QcmSessionService
  ) {

  }

  ngOnInit() {
    this.currentQcmSession = this.qcmSessionService.currentQcmSession;
    if(this.currentQcmSession) {
      console.log(this.currentQcmSession);
      this.chapters = this.currentQcmSession.qcm.chapters;
    } else {
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
    


  }

  getQuizz(id: number) {
    this.qcmSessionService.get(id).toPromise().then((res) => {
      var qcmSession = res.result.data;
      this.qcmSessionService.currentQcmSession = qcmSession;
      this.currentQcmSession = qcmSession;
      this.chapters = this.currentQcmSession.qcm.chapters;
      console.log(this.currentQcmSession);
      this.cdr.detectChanges();
    });
  }

  goToQuestions(idChapter: number) {
    this.router.navigateByUrl('/quizz/'+ this.currentQcmSession.id +'/chapter/'+ idChapter +'/question');
  }

  isChapterFilled(chapter: any) {
    var questionsNotFilled = chapter.questions.find(question => {
      var questionFilled = question.responses.find(response => response.isSelected == true);
      return !questionFilled;
    })

    return questionsNotFilled? false: true;
  }

}
