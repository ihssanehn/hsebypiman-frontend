import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizzComponent } from './quizz.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChapterComponent } from './chapter/chapter.component';
import { QuestionComponent } from './question/question.component';
import { ResultComponent } from './result/result.component';


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
				path: 'chapter',
				component: ChapterComponent,
			},
			{
				path: 'question',
				component: QuestionComponent,
			},
			{
				path: 'result',
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
    ResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class QuizzModule { }
