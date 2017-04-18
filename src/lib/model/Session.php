<?php
namespace Uomi\Model;

class Session extends \Illuminate\Database\Eloquent\Model {

	protected $hidden = ['id'];

	// Cast these fields to dates
	protected $dates = ['created_at','updated_at'];
}
