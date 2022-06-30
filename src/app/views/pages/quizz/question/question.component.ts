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
  currentChapterIndex: number = 0;
  questions: any;
  questionCounter: number = 1;
  totalQuestions: number = 0;

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
        if (idQcmSession) {
            this.getQuizz(idQcmSession);
        } else {
          this.router.navigateByUrl('/quizz/home');
        }
      }
    );


  }

  ngAfterViewInit(): void {
  }

  getQuizz(id: number) {
    this.qcmSessionService.get(id).toPromise().then((res) => {
      var qcmSession = res.result.data;
      this.qcmSessionService.currentQcmSession = qcmSession;
      this.currentQcmSession = qcmSession;
      this.questions = this.currentQcmSession.qcm.questions;
      this.totalQuestions = this.questions.length
      console.log(this.questions, this.totalQuestions);
      this.cdr.detectChanges();
    });
  }

  nextSlide() {
    var question = this.questions[this.currentSlideIndex];
    var selectedResponses = question.responses.filter(res => res.isSelected);

    if (selectedResponses.length) {
      this.setAnswer(selectedResponses);
      if(this.questionSwiper.swiper.isEnd) {
        this.goToResult();
      } else {
        this.questionSwiper.swiper.slideNext();
        this.questionCounter++;
        this.currentSlideIndex++;

        if(this.isChapterChanged()) {
          // this.questionCounter = 1;
          this.currentChapterIndex++;
        }
      }
    } else {
      console.log("Veuillez sélectionner une réponse !")
    }
    
  }

  isChapterChanged() {
    var lastQuestion = this.questions[this.currentSlideIndex-1];
    var currentQuestion = this.questions[this.currentSlideIndex];

    return lastQuestion.chapter_id != currentQuestion.chapter_id;
  }

  markForCheck(){
    return this.cdr.markForCheck();
  }

  previousSlide() {
    if(this.currentSlideIndex) {
      this.questionSwiper.swiper.slidePrev();
      if(this.isChapterChanged()) {
        this.questionCounter = this.questions[this.currentSlideIndex-1].chapter.questions_count;
        this.currentChapterIndex--;
      } else {
        this.questionCounter--;
      }
      this.currentSlideIndex--;
    }
  }

  displayChapterQuestions(chapter: any) {
    var question = this.questions.find(q => q.chapter_id == chapter.idChapter);
    var index = this.questions.indexOf(question);
    this.currentChapterIndex = chapter.index;
    this.slideToThis(index);
  }
  
  slideToThis(index) {
    this.questionCounter = 1;
    this.currentSlideIndex = index;
    this.questionSwiper.swiper.slideTo(index);
  }


  goToResult() {
    this.router.navigateByUrl('/quizz/'+this.currentQcmSession.id+'/result');
  }

  setAnswer(responses: any[]) {
    var idResponses = responses.map(res => res.id);
    var params = {
      'qcm_session_id': this.currentQcmSession.id,
      'response_ids': idResponses
    }
    this.qcmAnswerService.create(params).toPromise();
  }


}
