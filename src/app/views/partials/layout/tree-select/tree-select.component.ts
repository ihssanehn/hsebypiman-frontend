import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { RecursiveSearchPipe } from '@app/core/_base/layout';
import { debounceTime } from 'rxjs/operators';
import { find } from 'lodash';

@Component({
  selector: 'tf-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: ['./tree-select.component.scss']
  
})
export class TreeSelectComponent implements OnInit {

  @Input()
  itemsList: any;

  @Input()
  translateTitle: any;
  
  @Input()
  required: boolean = false;
  
  @Input()
  withAll: boolean = false;

  @Input()
  fromId: number= null;

  @Output() 
  onChangedItem = new EventEmitter<any>();

  searchForm: FormGroup;
  lastItem:number = null;
  array:Array<any> = [];
  tree:Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private recursiveSearchPipe:RecursiveSearchPipe,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.initForm();
    
    this.cdr.markForCheck();
  }

  initForm(){
    this.searchForm = this.fb.group({
      items: this.fb.array([]),
    })

    this.items.valueChanges.pipe(
      debounceTime(100)
    ).subscribe(x=>{    
      if(this.required){
        var last = x[x.length-1];
        if(last['item'] && last['item'].id && (!last['item'].children || last['item'].children.length == 0)){
          this.changeItem(last['item'].id);
        }else{
          this.changeItem(null);
        }
      }else{
        var list = x.filter(y=>y['item'] != null);
        if(list.length > 0){
          var last = list[list.length-1];
          this.changeItem(last['item'] != null ? last['item'].id : null);
        }else{
          this.changeItem(null);
        }
      }
    })
    if(this.fromId){
      let tree = this.retrieveItem(this.fromId);
      for (let i = 0; i < tree.length; i++) {
        const element = tree[i];
        this.addChild();
        this.items.at(i).get('item').setValue(element);
      }
    }else{
      this.addChild();
    }
  }
  
  addChild(){
    
    const child = this.fb.group({
      item: this.required ? [null, Validators.required] : null,
    })
    this.items.push(child);

  }

  

  removeChild(){
    
  }

  getItemsList(index){
    if(index == 0){
      return this.itemsList;
    }else{
      if(this.items.at(index-1).value['item']['children']){
        return this.items.at(index-1).value['item']['children']
      }
    }
  }

  changeItem(data : any): void{
    this.onChangedItem.emit( data );
  }

  itemChange($event, i){
    if($event.value){
      if(i + 1 < this.items.value.length){
        if($event.value.children && $event.value.children.length > 0){
          this.clearTreeValue(i+1)
        }else{
          this.clearTreeValue(i)
        }
      }else{
        if($event.value.children && $event.value.children.length > 0){
          this.addChild();
        }
      }
    }
  }

  formHasIndexValue(index){
    return this.items.value[index] ? true:false;
  }

  clearTreeValue(index){
    var array = this.items as FormArray;
    if(array.at(index)){
      array.at(index).get('item').patchValue(null);
      for(var i = array.value.length; i >= index+1  ; i--){
        array.removeAt(i);
      }
    }
  }
  
  getSelectedItem(index){
    if(!this.items.at(index).value['id']){
      return null;
    }
    var items = this.recursiveSearchPipe.transform(this.itemsList, this.items.at(index).value['id'], 'id', 'children');
    if(items && items.length > 0){
      return items[0];
    };
  }

  retrieveItem(id){
    var items = this.recursiveSearchPipe.transform(this.itemsList, id, 'id', 'children');
    if(items && items.length > 0){
      this.tree.unshift(items[0]);
      var item = items[0]
      if(item.parent_id){
        this.retrieveItem(item.parent_id);
      }
      
      return this.tree;
    }
    
  }

  getControlItemIndex(index){
    const items = this.searchForm.get('items') as FormArray;
    return items.at(index) as FormControl;
  }

  /**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationCategorie: string => Equals to valitors name
	 */
	isControlAtIndexHasError(index, validationCategorie: string): boolean {
     const group = this.items.at(index) as FormGroup;
     const control = group.controls['item'];
		if (!control) {
			return false;
		}
		const result = control.hasError(validationCategorie) && (control.dirty || control.touched);
		return result;
  }

  get items(): FormArray{
    return this.searchForm.get('items') as FormArray;
  }
}
