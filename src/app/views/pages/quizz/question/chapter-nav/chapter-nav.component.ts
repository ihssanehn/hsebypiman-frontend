import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { QcmSession } from '@app/core/models';
import { QcmSessionService } from '@app/core/services';
import { environment } from '@env/environment';

@Component({
  selector: 'tf-chapter-nav',
  templateUrl: './chapter-nav.component.html',
  styleUrls: ['./chapter-nav.component.scss']
})
export class ChapterNavComponent implements OnInit {

  @Input() currentChapterIndex: number = 0;
	@Output() onSelectChapter: EventEmitter<any> = new EventEmitter<any>();

  currentQcmSession: QcmSession;
  chapters: any[];
  storageUrl: string = environment.storageBaseUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public qcmSessionService: QcmSessionService,
		public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.currentQcmSession = this.qcmSessionService.currentQcmSession;

    if(this.currentQcmSession) {
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
      this.cdr.detectChanges();
    });
  }

  displayChapterQuestions(index: number, idChapter: number) {
    console.log(idChapter);
    this.onSelectChapter.emit({
      idChapter: idChapter,
      index: index
    });
  }

  isSelected(index: number) {
    var currentChapterIndex = this.currentChapterIndex;
    return index <= currentChapterIndex;
  }
}
