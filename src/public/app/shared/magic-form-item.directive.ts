import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({ selector: '[magicFormItem]' })
export class MagicFormItemDirective implements OnInit { 

	private textField: ElementRef;
	constructor(private element: ElementRef) {}

	ngOnInit() {
		this.textField = new ElementRef(this.element.nativeElement.querySelector('.text-input'));
	}

	@HostListener('focusin') onFocusIn() {
		this.addClass('form-focus');
	}

	@HostListener('focusout') onFocusOut() {
		this.removeClass('form-focus');
	}

	@HostListener('keyup') onKeyUp() {
		if(this.isEmpty()) {
			this.removeClass('form-filled');
		} else {
			this.addClass('form-filled');
		}
	}

	addClass(name: string) {
		this.element.nativeElement.classList.add(name);
	}

	removeClass(name: string) {
		this.element.nativeElement.classList.remove(name);
	}

	isEmpty(): boolean {
		return this.textField.nativeElement.value === '';
	}
}
