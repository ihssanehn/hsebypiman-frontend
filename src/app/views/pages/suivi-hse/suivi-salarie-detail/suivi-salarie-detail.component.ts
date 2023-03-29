import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'tf-suivi-salarie-detail',
  templateUrl: './suivi-salarie-detail.component.html',
  styleUrls: ['./suivi-salarie-detail.component.scss']
})
export class SuiviSalarieDetailComponent implements OnInit, OnDestroy {

  userId: number;

  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router
  ) {}

  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(
      async params => {
        const id = params.id;
        if (id) {
          this.userId = id;
        } else {
          this.router.navigateByUrl('/suivi-hse/list');
        }
      }
    );
  }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
  
}
