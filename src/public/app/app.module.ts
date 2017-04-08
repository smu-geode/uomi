import { NgModule }      from '@angular/core';
import { FormsModule }	 from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { RegistrationComponent } from './registration/registration.component';
// import { SubComponent } from './sub/sub.component';

@NgModule({
	imports:      [ BrowserModule,
					FormsModule ],
	declarations: [ AppComponent,
					RegistrationComponent /* , SubComponent */ ],
	bootstrap:    [ AppComponent ]
})
export class AppModule { }
