<?php
namespace Uomi\Model;

use Uomi\HashedPassword;

class User extends \Illuminate\Database\Eloquent\Model {

	// wrap the password field (passed in by $value)
	// in a HashedPassword object.
	public function getPasswordAttribute($value): HashedPassword {
		return HashedPassword::withHash($value, $this->salt);
	}

	public function setPasswordAttribute(HashedPassword $value) {
		$this->attributes['password'] = $value->getHash();
		$this->attributes['salt'] = $value->getSalt();
	}

	// Cast these columns before sending to the API
	// protected $casts = [
	//     'validated' => 'boolean',
	// ];

	public function loansFrom() {
		return $this->hasMany('\Uomi\Model\Loan', 'from_user');
	}

	public function loansTo() {
		return $this->hasMany('\Uomi\Model\Loan', 'to_user');
	}

	public function getLoansAttribute() {
		return $this->loansFrom()->union($this->loansTo()->toBase());
	}

	// This is a whitelist for mass-assignable properties
	protected $fillable = ['id', 'created_at', 'updated_at'];

	// Hide this information from the API
	protected $hidden = ['password','salt'];

	// Cast these fields to dates
	protected $dates = ['created_at','updated_at'];
}
