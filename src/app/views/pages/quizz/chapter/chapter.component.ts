import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { QcmSession } from '@app/core/models';
import { QcmSessionService } from '@app/core/services';
import { environment } from '@env/environment';

@Component({
  selector: 'tf-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit {

  currentQcmSession: QcmSession;
  currentChapterIndex: number;

  chapters: any[];
  storageUrl: string = environment.storageBaseUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private qcmSessionService: QcmSessionService,
    private iconRegistry: MatIconRegistry, 
		public sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon('picto-piman-vert',this.sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-piman-vert.svg'));

  }

  ngOnInit() {
    this.currentQcmSession = this.qcmSessionService.currentQcmSession;
    this.currentChapterIndex = this.qcmSessionService.currentChapterIndex;
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
