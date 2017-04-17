<?php
namespace Uomi\Model;

class Session extends \Illuminate\Database\Eloquent\Model {

	public function session(){
		return $this->hasOne('Uomi\Model\User', 'session');
	}

	public function created_at(){
		return $this->hasOne('Uomi\Model\User', 'created_at');
	}

}
