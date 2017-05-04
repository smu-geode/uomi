import { Directive, ElementRef, AfterContentChecked } from '@angular/core';

@Directive({ selector: '[focusOnLoad]' })
export class FocusOnLoadDirective implements AfterContentChecked { 

	private isFocused: boolean = false;

	constructor(private element: ElementRef) {}

	ngAfterContentChecked() {
		this.doFocus();
	}

	doFocus() {
		if(!this.isFocused) {
			this.element.nativeElement.focus();
			this.isFocused = true;
		}
	}
}
