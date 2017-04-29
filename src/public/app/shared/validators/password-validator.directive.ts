import { Directive } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl } from "@angular/forms";

@Directive({
  selector: '[password]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true }
  ]
})
export class PasswordValidatorDirective implements Validator {  
  validate(control: AbstractControl): { [key: string]: any } {
      var isValid = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{8,}$").test(control.value);
      return isValid ? null : { 'password': true };
  }
}
