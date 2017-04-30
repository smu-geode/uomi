import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication-service';
import { UsersService } from '../services/users-service';

@Component({
	selector: 'update-password-form',
	templateUrl: './update-password-form.component.html',
	providers: [ AuthenticationService ]
})

export class UpdatePasswordFormComponent implements OnInit {

	private oldPassword: string;
	private newPassword: string;
	private newPasswordVerify: string;

	@Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

	constructor(private authService: AuthenticationService,
				private usersService: UsersService,
				private router: Router,
				private route: ActivatedRoute) {}

	ngOnInit() {
		this.authService.rerouteIfAuthenticated('/dashboard');
		this.authService.rerouteIfNotAuthenticated('/login');
	}

	updatePassword(formRef: any) {
		this.usersService.updatePassword(+sessionStorage.getItem('user_id'), this.oldPassword, this.newPassword)
			.subscribe(x => {console.log(x); this.cancel(); formRef.reset()}, err => console.log(err));
	}

	cancel() {
		this.closeModal.emit();
	}
}
