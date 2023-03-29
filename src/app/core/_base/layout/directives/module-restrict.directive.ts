import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModuleService } from '@app/core/services'; 

@Directive({selector: '[ifAllModules]'})

export class IfAllModulesDirective {
  modules$ : Subscription;
  @Input("ifAllModules") moduleName : string[];

  constructor( private templateRef : TemplateRef<any>,
               private viewContainer : ViewContainerRef,
               private moduleService : ModuleService ) {
  }

  ngOnInit() {

	if(!this.moduleService.isActived(this.moduleName)){
		this.viewContainer.clear()
	}else{
		this.viewContainer.createEmbeddedView(this.templateRef);
	}
    // this.modules$ = this.moduleService.currentModules
	//   .pipe(
	// 	tap(() => this.viewContainer.clear()),
	// 	filter(modules => modules === this.moduleName)
	//   )
	//   .subscribe(() => {
	// 	this.viewContainer.createEmbeddedView(this.templateRef);
	//   })

	//   console.log(this.templateRef);
  }

  ngOnDestroy() {
    // this.modules$.unsubscribe();
  }
}

@Directive({selector: '[ifInModules]'})

export class IfInModulesDirective {
  modules$ : Subscription;
  @Input("ifInModules") moduleName : string[];

  constructor( private templateRef : TemplateRef<any>,
               private viewContainer : ViewContainerRef,
               private moduleService : ModuleService ) {
  }

  ngOnInit() {

	console.log(this.moduleService.inModules(this.moduleName));

	if(this.moduleService.inModules(this.moduleName).length == 0){
		this.viewContainer.clear()
	}else{
		this.viewContainer.createEmbeddedView(this.templateRef);
	}
    // this.modules$ = this.moduleService.currentModules
	//   .pipe(
	// 	tap(() => this.viewContainer.clear()),
	// 	filter(modules => modules === this.moduleName)
	//   )
	//   .subscribe(() => {
	// 	this.viewContainer.createEmbeddedView(this.templateRef);
	//   })

	//   console.log(this.templateRef);
  }

  ngOnDestroy() {
    // this.modules$.unsubscribe();
  }
}