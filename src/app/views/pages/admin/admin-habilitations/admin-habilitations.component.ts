import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuAsideService, SubheaderService } from '@app/core/_base/layout';

@Component({
  selector: 'tf-admin-habilitations',
  templateUrl: './admin-habilitations.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHabilitationsComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }

}
