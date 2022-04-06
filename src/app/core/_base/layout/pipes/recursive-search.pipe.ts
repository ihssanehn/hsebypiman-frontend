// Angular
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns string from Array
 */
@Pipe({
	name: 'recursive-search'
})
export class RecursiveSearchPipe implements PipeTransform {
  private searchedItems: Array<any> = [];
  private key: string;
  private prop: string;
  private childrenPropName: string;

  transform(value: any, key?: any, prop?: any, childrenProp?: any): any {
    if(key != undefined) {
      this.searchedItems = [];
      this.key = key;
      this.prop = prop;
      this.childrenPropName = childrenProp;
      let searchResult = this.searchRecursive(value);
      return searchResult;
    }
    return value;
  }

  searchRecursive(value) {
    for(var i = 0; i < value.length; i++) {
      let lowerCaseName = value[i][this.prop];
      if(lowerCaseName == this.key) {
        this.searchedItems.push(value[i]);
      } else if(value[i][this.childrenPropName]) {
        if(value[i][this.childrenPropName].length > 0) {
          this.searchRecursive(value[i][this.childrenPropName]);
        }
      }
    }

    return this.searchedItems;
  }
}