import { Component } from '@angular/core';
import { UsersService } from '../services/users-service';

@Component({
	selector: 'dashbaord',
	templateUrl: './dashboard.component.html',
	providers: [ UsersService ]
})

export class DashboardComponent { 


	constructor(private usersService: UsersService) {
		
	}
}