<?php
namespace Uomi\Model;

class Payment extends \Illuminate\Database\Eloquent\Model {

	public function loan() {
		return $this->belongsTo('\Uomi\Model\Loan');
	}

	public function from() {
		return $this->belongsTo('\Uomi\Model\User', 'from_user');
	}

	public function to() {
		return $this->belongsTo('\Uomi\Model\User', 'to_user');
	}

	protected $hidden = ['loan', 'from', 'to'];
}
