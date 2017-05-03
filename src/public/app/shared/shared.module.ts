import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MagicFormItemDirective } from './magic-form-item.directive';
import { FocusOnLoadDirective } from './focus-on-load.directive';
import { CurrencyViewComponent } from './currency-view.component';
import { DropdownOpenDirective, DropdownContentDirective, DropdownDirective } from './dropdown.directive';
import { ModalComponent } from './modal/modal.component';
import { CurrencyValidatorDirective } from './validators/currency-validator.directive';
import { EmailValidatorDirective } from './validators/email-validator.directive';
import { PasswordValidatorDirective } from './validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from './validators/password-match-validator.directive';
import { NameValidatorDirective } from './validators/name-validator.directive';
import { ValidationMessagesComponent } from './validation-messages/validation-messages.component';

@NgModule({
	imports:      [ BrowserModule ],
	declarations: [ MagicFormItemDirective, FocusOnLoadDirective, CurrencyViewComponent, DropdownOpenDirective, DropdownContentDirective, DropdownDirective, ModalComponent, CurrencyValidatorDirective, EmailValidatorDirective, PasswordValidatorDirective, PasswordMatchValidatorDirective, NameValidatorDirective, ValidationMessagesComponent ],
	exports:      [ MagicFormItemDirective, FocusOnLoadDirective, CurrencyViewComponent, DropdownOpenDirective, DropdownContentDirective, DropdownDirective, ModalComponent, CurrencyValidatorDirective, EmailValidatorDirective, PasswordValidatorDirective, PasswordMatchValidatorDirective, NameValidatorDirective, ValidationMessagesComponent ]
})

export class SharedModule { }
