import { Component, enableProdMode } from '@angular/core';
import { AuthenticationService } from './services/authentication-service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
//   template: `<h1>Angular Works!</h1>`
})
export class AppComponent {

	private isAuthenticated: boolean;

	constructor(authService: AuthenticationService) {

		console.log(`Running uomi on the ${process.env.TARGET} target.`);
		if(process.env.TARGET === 'production') {
			enableProdMode();
		}

		// this.isAuthenticated = authService.isAuthenticated.getValue();
		authService.isAuthenticated.subscribe(newValue => {
			console.log('change:', newValue);
			this.isAuthenticated = newValue;
		});
	}
}
