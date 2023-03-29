import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

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
