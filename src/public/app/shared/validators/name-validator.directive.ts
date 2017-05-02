import { Directive } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl } from "@angular/forms";

@Directive({
  selector: '[valid_name]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NameValidatorDirective, multi: true }
  ]
})
export class NameValidatorDirective implements Validator {  
  validate(control: AbstractControl): { [key: string]: any } {
      var isValid = new RegExp("^[a-zA-Z ]+$").test(control.value);
      return isValid ? null : { 'valid_name': true };
  }
}