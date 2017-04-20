<?php

namespace Uomi\Model;

class Loan extends \Illuminate\Database\Eloquent\Model {

	protected $cast = [
		'confirmed' => 'boolean',
	];

	public function loaner() {
		return $this->hasOne('Uomi\Model\User', 'to');
	}

	public function borrower() {
		return $this->hasOne('Uomi\Model\User', 'from');
	}

	public function category() {
		return $this->hasOne('Uomi\Model\Category','category_id');
	}

	public function payments() {
		
		return $this->hasMany('Uomi\Model\Payment','loan_id');;
	}

	protected $dates = ['created_at', 'confirmed_at', 'completed_at'];

	protected $casts = [
		'confirmed' => 'boolean',
		'from_user' => 'int',
		'to_user' => 'int',
		'category_id' => 'int',
		'amount_cents' => 'int'
	];
}
