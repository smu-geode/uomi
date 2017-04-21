import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MagicFormItemDirective } from './magic-form-item.directive';
import { FocusOnLoadDirective } from './focus-on-load.directive';
import { CurrencyViewComponent } from './currency-view.component';

@NgModule({
	imports:      [ BrowserModule ],
	declarations: [ MagicFormItemDirective, FocusOnLoadDirective, CurrencyViewComponent ],
	exports: [ MagicFormItemDirective, FocusOnLoadDirective, CurrencyViewComponent ]
})

export class SharedModule { }
