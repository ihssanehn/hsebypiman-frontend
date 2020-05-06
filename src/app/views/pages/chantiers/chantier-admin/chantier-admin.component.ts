import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatHabilitationService } from '@app/core/services';
import { CatHabilitation } from '@app/core/models';


@Component({
  selector: 'tf-chantier-admin',
  templateUrl: './chantier-admin.component.html',
  styleUrls: ['./chantier-admin.component.scss']
})
export class ChantierAdminComponent implements OnInit {

  startEdit(data: any): void {
    data.edit = true;
  }

  cancelEdit(data : any): void {
    data.edit = false;
  }

  saveEdit(data : any): void {
    data.edit = false;
  }

  add(parent_id){
    const index = this.list.findIndex(item => item.id === parent_id);
    this.list[index].habilitations.push({edit: true})
  }


  list: any[];


  constructor(private catHabilitationService:CatHabilitationService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCatHabs();
  }


  async getCatHabs(){
    try {
      var res = await this.catHabilitationService.getAll().toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

}
