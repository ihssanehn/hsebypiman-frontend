import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QcmSession } from '@app/core/models';
import { QcmAnswerService, QcmSessionService } from '@app/core/services';
import { SwiperComponent } from 'ngx-useful-swiper';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'tf-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  currentQcmSession: QcmSession;
  currentSlideIndex: number = 0;
  chapter: any;
  counter: number = 1;

  @ViewChild('questionSwiper', { static: false }) questionSwiper: SwiperComponent;

  config: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    autoHeight: true,
    allowTouchMove: false,
    breakpoints: {
      1024: {
        slidesPerView: 1
      },
      500: {
        slidesPerView: 1
      },
      400: {
        slidesPerView: 1
      },
      300: {
        slidesPerView: 1
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    // loop: true
  };

  constructor(
    private qcmSessionService: QcmSessionService,
    private qcmAnswerService: QcmAnswerService,
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
            this.getQuizz(idQcmSession, idChapter);
        } else {
          this.router.navigateByUrl('/quizz/home');
        }
      }
    );


  }

  ngAfterViewInit(): void {
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

  nextSlide() {
    var question = this.chapter.questions[this.currentSlideIndex];
    var selectedResponses = question.responses.filter(res => res.isSelected);

    if (selectedResponses.length) {
      this.setAnswer(selectedResponses).then(res => {
        if(res.result.data.question_answered_count < res.result.data.question_count) {
          if (this.questionSwiper.swiper.isEnd) {
            this.goToChapter();
          } else {
            this.questionSwiper.swiper.slideNext();
            this.currentSlideIndex++;
          }
        } else {
          this.goToResult();
        }
      });
    } else {
      console.log("Veuillez sélectionner une réponse !")
    }
    
  }

  previousSlide() {
    if(this.currentSlideIndex) {
      this.questionSwiper.swiper.slidePrev();
      this.currentSlideIndex--;
    } else {
      this.router.navigateByUrl('/quizz/'+this.currentQcmSession.id+'/chapter');
    }
  }
  
  slideToThis(index) {
    this.questionSwiper.swiper.slideTo(index);
  }

  goToChapter() {
    this.qcmSessionService.currentChapterIndex++;
    this.router.navigateByUrl('/quizz/'+this.currentQcmSession.id+'/chapter');
  }

  goToResult() {
    this.qcmSessionService.currentChapterIndex = 0;
    this.router.navigateByUrl('/quizz/'+this.currentQcmSession.id+'/result');
  }

  async setAnswer(responses: any[]) {
    var idResponses = responses.map(res => res.id);
    var params = {
      'qcm_session_id': this.currentQcmSession.id,
      'response_ids': idResponses
    }
    return await this.qcmAnswerService.create(params).toPromise();
  }


}
