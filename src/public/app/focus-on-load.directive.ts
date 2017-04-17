import { Directive, ElementRef, AfterContentChecked } from '@angular/core';

@Directive({ selector: '[focusOnLoad]' })
export class FocusOnLoadDirective implements AfterViewChecked { 

	private isFocused: boolean;

	constructor(private element: ElementRef) {
		this.isFocused = false;
	}

	ngAfterViewChecked() {
		this.doFocus();
	}

	doFocus() {
		if(!this.isFocused) {
			this.element.nativeElement.focus();
			this.isFocused = true;
		}
	}
}
