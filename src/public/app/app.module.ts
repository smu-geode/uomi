import { NgModule }      from '@angular/core';
import { FormsModule }	 from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { SubComponent } from './sub/sub.component';

import { MagicFormItemDirective } from './magic-form-item.directive';
import { FocusOnLoadDirective } from './focus-on-load.directive';

var routes = [
	{
		path: '',
		component: RegistrationComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'dashboard',
		component: DashboardComponent
	}
];

@NgModule({
	imports:      [ BrowserModule,
					FormsModule,
					HttpModule,
					RouterModule.forRoot(routes) ],
	declarations: [ AppComponent,
					RegistrationComponent,
					LoginComponent,
					DashboardComponent,
					MagicFormItemDirective,
					FocusOnLoadDirective ],
	bootstrap:    [ AppComponent ]
})
export class AppModule { }
