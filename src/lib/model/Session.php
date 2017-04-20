<?php
namespace Uomi\Model;

class Session extends \Illuminate\Database\Eloquent\Model {

	public function user() {
		return $this->belongsTo('\Uomi\Model\User');
	}

	protected $hidden = ['id', 'user'];

	// Cast these fields to dates
	protected $dates = ['created_at','updated_at'];
}
