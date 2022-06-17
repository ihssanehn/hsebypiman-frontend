import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@app/core/auth';
import { QcmSessionService } from '@app/core/services';

@Component({
  selector: 'tf-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: User;

  constructor(
    private authService: AuthService,
    private qcmSessionService: QcmSessionService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.authService.currentUser.subscribe(x=> this.user = x);
  }

  ngOnInit() {
  }

  startQuizz() {
    var params = {
      'user_id': this.user.id,
      'qcm_id': 1,
      'score': 0
    };

    this.qcmSessionService.create(params).toPromise().then((result) => {
      this.getQuizz(result.result.data.id);
    })
    .catch(err => {

    });

  }

  getQuizz(id: number) {
    this.qcmSessionService.get(id).toPromise().then((res) => {
      var qcmSession = res.result.data;
      this.qcmSessionService.currentQcmSession = qcmSession;
      this.router.navigateByUrl('/quizz/'+qcmSession.id+'/chapter');
    });
  }

}
