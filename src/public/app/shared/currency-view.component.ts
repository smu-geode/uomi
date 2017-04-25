import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'currency-view',
	template: 
	`
	<span class="currency-symbol">{{currencySymbol}}</span><span *ngIf="valid()"><span class="currency-integer">{{integralPart}}</span><span class="currency-decimal-mark" *ngIf="fractionalPart!=''">.</span><span class="currency-fraction">{{fractionalPart}}</span></span><span *ngIf="!valid()">__</span>
	`,
	providers: [  ],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class CurrencyViewComponent { 
	@Input()
	amountCents: number;

	@Input()
	decimalMark: string = '.';

	@Input()
	currencySymbol: string = '$';

	get integralPart(): string {
		let x = this.amountCents;
		let s = this.amountCents.toString();
		if(x == 0 || s.length < 3) {
			return '0';
		}
		return s.slice(0, -2);
	}

	get fractionalPart(): string {
		let x = this.amountCents;
		let s = this.amountCents.toString();
		if(x == 0) {
			return '';
		}
		let f = s.slice(-2);
		if(f.length < 2) {
			f = '0'+f;
		}
		if(f==='00') return '';
		return f;
	}

	protected valid(): boolean {
		return !isNaN(this.amountCents);
	}

	
}
