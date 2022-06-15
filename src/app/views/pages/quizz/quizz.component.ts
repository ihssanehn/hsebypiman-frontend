import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthNoticeService } from '@app/core/auth';
import { LayoutConfigService, SplashScreenService, TranslationService } from '@app/core/_base/layout';

@Component({
  selector: 'tf-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent implements OnInit {

	constructor() {
	}

  ngOnInit() {
  }

}
