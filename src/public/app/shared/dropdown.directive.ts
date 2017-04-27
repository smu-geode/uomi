import { Directive, ElementRef, AfterContentInit, QueryList, ContentChild, HostListener } from '@angular/core';
// import * as Tether from 'tether';

@Directive({ selector: '[dropdownOpen]' })
export class DropdownOpenDirective {

	private delegate: DropdownDirective;
	constructor(public element: ElementRef) {}

	setDelegate(delegate: DropdownDirective) {
		this.delegate = delegate;
	}

	@HostListener('click')
	didClick() {
		this.delegate && this.delegate.toggle();
	}
}

@Directive({ selector: '[dropdownContent]' })
export class DropdownContentDirective {

	private delegate: DropdownDirective;
	constructor(public element: ElementRef) {}

	setDelegate(delegate: DropdownDirective) {
		this.delegate = delegate;
	}
}

@Directive({ selector: '[dropdown]' })
export class DropdownDirective implements AfterContentInit { 
	@ContentChild(DropdownOpenDirective) opener: DropdownOpenDirective;
	@ContentChild(DropdownContentDirective) content: DropdownContentDirective;

	private isOpen: boolean = false;

	constructor(public element: ElementRef) {}

	ngAfterContentInit() {
		this.opener.setDelegate(this);
		this.content.setDelegate(this);
	}

	toggle() {
		if(this.isOpen) {
			this.close();
		} else {
			this.open();
		}
	}

	open() { 
		this.isOpen = true;
		this.element.nativeElement.classList.add('dropdown-open');
	}

	close() {
		this.isOpen = false;
		this.element.nativeElement.classList.remove('dropdown-open');
	}
}
