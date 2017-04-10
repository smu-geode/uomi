<?php

namespace Uomi\Model;

class Category extends \Illuminate\Database\Eloquent\Model {
	
	public function loan() {
		return $this->belongsTo('\Uomi\Loan');
	}
	
}
