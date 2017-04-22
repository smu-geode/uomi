import { NgModule }      from '@angular/core';
import { FormsModule }	 from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModalComponent } from './modal/modal.component';
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
	}//,
	// {
	// 	path: 'lend',
	// 	component: LoanModalComponent
	// },
	// {
	// 	path: 'borrow/:userId',
	// 	component: LoanModalComponent
	// }
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
					DashboardComponent,
					FrontPageComponent,
					ModalComponent ],
	bootstrap:    [ AppComponent ],
	providers:	  [ AuthenticationService, UsersService ]
})
export class AppModule { }
