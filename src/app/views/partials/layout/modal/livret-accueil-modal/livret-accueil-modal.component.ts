import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService, User } from '@app/core/auth';
import { UserService } from '@app/core/services';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tf-livret-accueil-modal',
  templateUrl: './livret-accueil-modal.component.html',
  styleUrls: ['./livret-accueil-modal.component.scss']
})
export class LivretAccueilModalComponent implements OnInit {

  user: User;
  checked: boolean = false;
  livretAccueilPath;
  iframeHeight = window.innerHeight - 200
  scroll$: any = null;

  @ViewChild('livretIframe', {static: true}) frame : ElementRef;

	constructor(
    private sanitize: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
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
    await this.userService.validateLivretAccueil(this.user.id).toPromise().then(res=>{
      this.authService.reloadUser().toPromise().then( res =>{
        console.log(res)
        this.cdr.markForCheck();
        this.activeModal.close();
      });
    });
  }

}
