<?php
namespace Uomi\Model;
class Settings extends \Illuminate\Database\Eloquent\Model {
	public function user() {
		return $this->belongsTo('Uomi\User','user_id');
	}
	//protected $settings = ['allNotifications', 'borrowingRequests', 'payBackReminders', 'viewEmail'];
	protected $hidden = ['user_id', 'created_at', 'updated_at'];
}
