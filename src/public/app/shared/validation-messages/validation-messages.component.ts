import { Component, Input } from '@angular/core';

@Component({
  selector: 'validation-messages',
  template: `<ul *ngIf="model.errors && model.touched" class="color-danger form-item" role="alert">
				<li *ngFor="let validator of validators"
					[hidden]="!model.errors[validator.key]">
					{{ validator.message }}
				</li>
            </ul>`
})

export class ValidationMessagesComponent { 

    @Input() model: any;
    @Input() set messages(value: string) {
        this.validators = [];
        Object.keys(value).forEach(x => {
            this.validators.push({ key: x, message: value[x] });
        });
    }

    validators: any[];
}