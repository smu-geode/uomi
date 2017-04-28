import { Directive, ElementRef, Input, AfterContentInit, QueryList, ContentChild, HostListener } from '@angular/core';
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

@Directive({ 
	selector: '[dropdownContent]',
	host: {'(document:click)': 'didClickPage($event)'}
})
export class DropdownContentDirective {

	private delegate: DropdownDirective;
	constructor(public element: ElementRef) {}

	setDelegate(delegate: DropdownDirective) {
		this.delegate = delegate;
	}

	didClickPage(event: any) {

		let target = event.target;
		let contentElement = this.element.nativeElement;
		let delegateElement = this.delegate.element.nativeElement;

		if(this.delegate == null) {
			return;
		}

		if(this.delegate.isOpen === false) {
			return;
		}

		// close on content click if closeOnClick is true
		let clickedContent = contentElement.contains(target);
		if(clickedContent && this.delegate.closeOnClick) {
			this.delegate.close();
		}

		// otherwise check if click was outside
		let clickOutside = !clickedContent 
			&& !delegateElement.contains(target);

		if(clickOutside) {
			this.delegate.close(); 
		}
	}
}

@Directive({ selector: '[dropdown]' })
export class DropdownDirective implements AfterContentInit { 
	@ContentChild(DropdownOpenDirective) opener: DropdownOpenDirective;
	@ContentChild(DropdownContentDirective) content: DropdownContentDirective;

	public isOpen: boolean = false;

	@Input()
	public closeOnClick: boolean = true;

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
		if(this.isOpen === true) { return; }
		this.isOpen = true;
		this.element.nativeElement.classList.add('dropdown-open');
	}

	close() {
		if(this.isOpen === false) { return; }
		this.isOpen = false;
		this.element.nativeElement.classList.remove('dropdown-open');
	}
}
