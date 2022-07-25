import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuAsideService, SubheaderService } from '@app/core/_base/layout';

@Component({
  selector: 'tf-admin-formations',
  templateUrl: './admin-formations.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminFormationsComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }

}
