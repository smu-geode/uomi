import { Directive, ElementRef, AfterContentChecked } from '@angular/core';

@Directive({ selector: '[focusOnLoad]' })
export class FocusOnLoadDirective implements AfterContentChecked { 

	private isFocused: boolean;

	constructor(private element: ElementRef) {
		this.isFocused = false;
	}

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
