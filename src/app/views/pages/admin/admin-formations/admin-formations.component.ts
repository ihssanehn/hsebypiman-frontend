import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

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
