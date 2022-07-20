import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuAsideService, SubheaderService } from '@app/core/_base/layout';

@Component({
  selector: 'tf-formations',
  templateUrl: './formations.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormationsComponent implements OnInit {

  constructor(
    public menuAsideService: MenuAsideService,
		public subheaderService: SubheaderService
  ) { }

  ngOnInit() {
    this.menuAsideService.loadMenuAside('aside.formations');
		this.subheaderService.loadSubheader('');
  }

}
