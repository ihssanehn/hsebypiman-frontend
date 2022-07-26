import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthNoticeService, AuthService, User } from '@app/core/auth';
import { UserService } from '@app/core/services';
import { LayoutConfigService, SplashScreenService, TranslationService } from '@app/core/_base/layout';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'tf-livret-accueil',
  templateUrl: './livret-accueil.component.html',
  styleUrls: ['./livret-accueil.component.scss']
})
export class livretAccueilComponent implements OnInit {

  user: User;
  checked: boolean = false;
  livretAccueilPath;
  iframeHeight = window.innerHeight - 200
  scroll$: any = null;

  @ViewChild('livretIframe', {static: true}) frame : ElementRef;

	constructor(
    private sanitize: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.livretAccueilPath = this.sanitize.bypassSecurityTrustResourceUrl(environment.apiBaseUrl+"livret-accueil")
	}

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
			if(user){
        this.user = user;
			}
		});
  }

  NgOnDestroy() {
    this.scroll$.unsubscribe();
  }

  onFrameLoad() {

  }

  async validate() {
    var res = await this.userService.validateLivretAccueil(this.user.id).toPromise();
    if(this.user.is_firstConnexion){
      this.router.navigateByUrl('/auth/edit-password');
    }else{
      this.router.navigateByUrl('/');
    }
    this.cdr.markForCheck();
  }

}
