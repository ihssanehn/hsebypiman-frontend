import { Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

@Directive({
	selector: `date-mask, [date-mask], [dateMask]`
})
export class MaskDirective implements OnInit, OnDestroy {
  @HostBinding('class.fed-mask') compClass = true;

  @Input()
  dateMask = {
    mask: [],
    showMask: false,
    guide: true,
    placeholderChar: '_'
  };

  maskedInputController;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.maskedInputController = textMask.maskInput({
      inputElement: this.element.nativeElement,
      ...this.dateMask
    });
  }

  ngOnDestroy() {
    this.maskedInputController.destroy();
  }
}
