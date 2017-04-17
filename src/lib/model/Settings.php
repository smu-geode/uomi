<?php
namespace Uomi\Model;
class Settings extends \Illuminate\Database\Eloquent\Model {
	public function settings() {
		return $this->hasOne('Uomi\Model\User','user_id');
	}
	//protected $settings = ['allNotifications', 'borrowingRequests', 'payBackReminders', 'viewEmail'];
}
