import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TypeService } from '@app/core/services';
import { Type } from '@app/core/models';

@Component({
  selector: 'tf-visite-outillage-admin',
  templateUrl: './visite-outillage-admin.component.html',
  styleUrls: ['./visite-outillage-admin.component.scss']
})
export class VisiteOutillageAdminComponent implements OnInit {

  types: Type[];
  constructor(
    private typeService: TypeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getTypes();

  }

  async getTypes(){
      var res = await this.typeService.getAllFromModel('VsOutillage').toPromise();
      this.types = res.result.data
      console.log(this.types);
      this.cdr.detectChanges();
      this.cdr.markForCheck();
  }


}
