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
	private userName: string = "";

	@Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
	@Output() switchSettings: EventEmitter<void> = new EventEmitter<void>();

	constructor(private authService: AuthenticationService,
				private usersService: UsersService,
				private router: Router,
				private route: ActivatedRoute) {}

	ngOnInit() {
		this.authService.rerouteIfAuthenticated('/dashboard');
		this.authService.rerouteIfNotAuthenticated('/login');

		this.usersService.getUserInfo(+sessionStorage.getItem('user_id')).subscribe(x => {
			this.userName = x['name'] || "";
		}, err => console.log(err));
	}

	updatePassword(formRef: any) {
		this.usersService.updatePassword(+sessionStorage.getItem('user_id'), this.oldPassword, this.newPassword)
			.subscribe(x => {console.log(x); this.cancel(); formRef.reset()}, err => console.log(err));
	}

	updateName(formRef: any) {
		this.usersService.updateUserName(+sessionStorage.getItem('user_id'), this.userName)
			.subscribe(x => {console.log(x); this.cancel(); formRef.reset()}, err => console.log(err));
	}

	cancel() {
		this.userName = "";
		this.oldPassword = "";
		this.newPassword = "";
		this.newPasswordVerify = "";
		this.closeModal.emit();
	}

	switchToSettingsModal() {
		this.switchSettings.emit();
	}
}
