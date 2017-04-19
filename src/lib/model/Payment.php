<?php
namespace Uomi\Model;

class Payment extends \Illuminate\Database\Eloquent\Model {

	public function loan() {
		return $this->belongsTo('\Uomi\Loan');
	}
}
