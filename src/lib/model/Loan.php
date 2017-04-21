<?php

namespace Uomi\Model;

class Loan extends \Illuminate\Database\Eloquent\Model {

	protected $cast = [
		'confirmed' => 'boolean',
	];

	public function from() {
		return $this->belongsTo('Uomi\Model\User', 'from_user');
	}

	public function to() {
		return $this->belongsTo('Uomi\Model\User', 'to_user');
	}

	public function category() {
		return $this->belongsTo('Uomi\Model\Category','category_id');
	}

	public function payments() {
		
		return $this->hasMany('Uomi\Model\Payment','loan_id');;
	}

	protected $dates = ['created_at', 'confirmed_at', 'completed_at'];

	protected $casts = [
		'confirmed' => 'boolean',
		'amount_cents' => 'int'
	];

	protected $with = ['from', 'to', 'category'];
	protected $hidden = ['from_user', 'to_user', 'category_id'];
}
