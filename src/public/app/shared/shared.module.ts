import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MagicFormItemDirective } from './magic-form-item.directive';
import { FocusOnLoadDirective } from './focus-on-load.directive';
import { CurrencyViewComponent } from './currency-view.component';
import { DropdownOpenDirective, DropdownContentDirective, DropdownDirective } from './dropdown.directive';
import { ModalComponent } from './modal/modal.component';

@NgModule({
	imports:      [ BrowserModule ],
	declarations: [ MagicFormItemDirective, FocusOnLoadDirective, CurrencyViewComponent, DropdownOpenDirective, DropdownContentDirective, DropdownDirective, ModalComponent ],
	exports:      [ MagicFormItemDirective, FocusOnLoadDirective, CurrencyViewComponent, DropdownOpenDirective, DropdownContentDirective, DropdownDirective, ModalComponent ]
})

export class SharedModule { }
