<?php
namespace Uomi\Model;

class Loan extends \Illuminate\Database\Eloquent\Model {
	
	protected $cast = [
		'confirmed' => 'boolean',
	];

	public function users() {
		return $this->hasMany('Uomi\User','id');
	}

	public function payments() {
		return $this->hasMany('Uomi\Payment','loan_id');
	}

	protected $dates = ['created_at', 'confirmed_at', 'completed_at'];
}
