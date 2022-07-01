import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { QcmSession } from '@app/core/models';
import { QcmSessionService, DocumentService } from '@app/core/services';
import { environment } from '@env/environment';
import { MatIconRegistry } from '@angular/material';

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
		public sanitizer: DomSanitizer,
    private documentService: DocumentService
  ) 
  {}

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
      this.chapters.forEach(chapter=>{
        // console.log(this.sanitizer.bypassSecurityTrustResourceUrl(this.storageUrl+chapter.img));
      })
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

  retrieveSvg(chapter){
    return this.documentService.getFileByPath(chapter.img);
  }
}
