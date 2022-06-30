import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizzComponent } from './quizz.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuestionComponent } from './question/question.component';
import { ResultComponent } from './result/result.component';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { QuestionSlideComponent } from './question/question-slide/question-slide.component';
import { MatIconModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { ChapterNavComponent } from './question/chapter-nav/chapter-nav.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { InterceptService, RefreshTokenIntercept, HttpUtilsService, TypesUtilsService, LayoutUtilsService } from '@app/core/_base/crud';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


const routes: Routes = [
	{
		path: '',
		component: QuizzComponent,
		children: [
      		{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full'
			},
			{
				path: 'home',
				component: HomeComponent
			},
			{
				path: ':id/questions',
				component: QuestionComponent,
			},
			{
				path: ':id/result',
				component: ResultComponent,
			}
		]
	}
];


@NgModule({
  declarations: [
    QuizzComponent,
    HomeComponent,
    QuestionComponent,
    ResultComponent,
    QuestionSlideComponent,
    ChapterNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
		NgxUsefulSwiperModule,
		MatIconModule,
		InlineSVGModule
  ],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		RefreshTokenIntercept,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: RefreshTokenIntercept,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'tf-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [

		// 
	]
})
export class QuizzModule { }
