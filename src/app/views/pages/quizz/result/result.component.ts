import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QcmSession } from '@app/core/models';
import { QcmSessionService } from '@app/core/services';

@Component({
  selector: 'tf-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  success: boolean = false;
  score: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private qcmSessionService: QcmSessionService
  ) { }

  ngOnInit() {
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

  getQuizz(id: number) {
    this.qcmSessionService.get(id).toPromise().then((res) => {
      var qcmSession = res.result.data;
      this.score = qcmSession.score;
      this.success = qcmSession.is_success;
      this.cdr.detectChanges();
    });
  }

}
