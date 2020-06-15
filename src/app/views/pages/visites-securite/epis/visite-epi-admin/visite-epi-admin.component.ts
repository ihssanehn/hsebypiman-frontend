import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TypeService } from '@app/core/services';
import { Type } from '@app/core/models';

@Component({
  selector: 'tf-visite-epi-admin',
  templateUrl: './visite-epi-admin.component.html',
  styleUrls: ['./visite-epi-admin.component.scss']
})
export class VisiteEpiAdminComponent implements OnInit {

  types: Type[];
  constructor(
    private typeService: TypeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getTypes();

  }

  async getTypes(){
      var res = await this.typeService.getAllFromModel('VsEpi').toPromise();
      this.types = res.result.data
      this.cdr.detectChanges();
      this.cdr.markForCheck();
  }

}
