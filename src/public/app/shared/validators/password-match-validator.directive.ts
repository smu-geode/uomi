import { Directive, Attribute } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl } from "@angular/forms";

@Directive({
  selector: '[passwordmatch]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: PasswordMatchValidatorDirective, multi: true }
  ]
})
export class PasswordMatchValidatorDirective implements Validator {
	constructor(@Attribute('passwordmatch') public validateEqual: string){}
	validate(control: AbstractControl): { [key: string]: any } {
		return (control.value == control.root.get(this.validateEqual).value) ? null : { 'passwordmatch': true };
	}
}