import { Directive } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl } from "@angular/forms";

@Directive({
  selector: '[currency]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: CurrencyValidatorDirective, multi: true }
  ]
})
export class CurrencyValidatorDirective implements Validator {  
  validate(control: AbstractControl): { [key: string]: any } {
      var isValid = new RegExp("^\d+(?:\.\d{0,2})?$").test(control.value);
      return isValid ? null : { 'currency': true };
  }
}