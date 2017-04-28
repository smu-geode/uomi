import { NgModule }      from '@angular/core';
import { FormsModule }	 from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { LendFormComponent } from './lend-form/lend-form.component';
import { BorrowFormComponent } from './borrow-form/borrow-form.component';
import { UsersService } from './services/users-service';
import { AuthenticationService } from './services/authentication-service';

import { SharedModule } from './shared/shared.module';

var routes = [
	{
		path: '',
		component: FrontPageComponent
	},
	{
		path: 'registration',
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
					BrowserAnimationsModule,
					FormsModule,
					HttpModule,
					RouterModule.forRoot(routes),
					SharedModule ],
	declarations: [ AppComponent,
					RegistrationComponent,
					LoginComponent,
					DashboardComponent,
					FrontPageComponent,
					PaymentFormComponent,
					LendFormComponent,
					BorrowFormComponent ],
	bootstrap:    [ AppComponent ],
	providers:	  [ AuthenticationService, UsersService ]
})
export class AppModule { }
