import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
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
    private router: Router,
    private iconRegistry: MatIconRegistry, 
		private sanitizer: DomSanitizer
  ) {
    this.authService.currentUser.subscribe(x=> this.user = x);
    this.iconRegistry.addSvgIcon('picto-secu-mixte',this.sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-secu-mixte.svg'));
    this.iconRegistry.addSvgIcon('picto-care',this.sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-care.svg'));
    this.iconRegistry.addSvgIcon('picto-feuille',this.sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/picto-feuille.svg'));
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
      this.router.navigateByUrl('/quizz/'+qcmSession.id+'/questions');
    });
  }

}
