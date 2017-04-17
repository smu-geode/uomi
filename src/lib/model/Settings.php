<?php
namespace Uomi\Model;
class Settings extends \Illuminate\Database\Eloquent\Model {
	public function user() {
		return $this->belongsTo('Uomi\Model\User','user_id');
	}
	//protected $settings = ['allNotifications', 'borrowingRequests', 'payBackReminders', 'viewEmail'];
}
