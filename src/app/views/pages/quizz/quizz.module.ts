import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizzComponent } from './quizz.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChapterComponent } from './chapter/chapter.component';
import { QuestionComponent } from './question/question.component';
import { ResultComponent } from './result/result.component';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { QuestionSlideComponent } from './question/question-slide/question-slide.component';
import { MatIconModule } from '@angular/material';
import { ChapterNavComponent } from './question/chapter-nav/chapter-nav.component';


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
			// {
			// 	path: ':id/chapter',
			// 	component: ChapterComponent,
			// },
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
    ChapterComponent,
    QuestionComponent,
    ResultComponent,
    QuestionSlideComponent,
    ChapterNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
	NgxUsefulSwiperModule,
	MatIconModule
  ]
})
export class QuizzModule { }
