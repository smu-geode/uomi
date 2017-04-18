import { NgModule }      from '@angular/core';
import { FormsModule }	 from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { SharedModule } from './shared/shared.module';

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
					RouterModule.forRoot(routes),
					SharedModule ],
	declarations: [ AppComponent,
					RegistrationComponent,
					LoginComponent,
					DashboardComponent ],
	bootstrap:    [ AppComponent ]
})
export class AppModule { }
