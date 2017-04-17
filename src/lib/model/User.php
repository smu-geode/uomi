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

	// friends the User has added
	protected function myFriends() {
		return $this->belongsToMany('Uomi\Model\User', 'friends', 'user_id', 'friend_id');
	}

	// users who have added this User as a friend
	protected function friendOf() {
		return $this->belongsToMany('Uomi\Model\User', 'friends', 'friend_id', 'user_id');
	}

	// all friends, bidirectional
	public function friends() {
		// return $this->myFriends()->get();//->merge($this->friendOf()->all());
		// return $this->
		return null;
	}

	/*public function settings() {
		return $this->hasOne('Uomi\Model\Settings', 'user_id');
	}*/

    // public function models() {
    //     return $this->hasMany('Uomi\Model','foreign_key_in_user');
    // }

	// Cast these columns before sending to the API
    // protected $casts = [
    //     'validated' => 'boolean',
    // ];

    // This is a whitelist for mass-assignable properties
    protected $fillable = ['id', 'created_at', 'updated_at'];

	// Hide this information from the API
    protected $hidden = ['password','salt'];

	// Cast these fields to dates
	protected $dates = ['created_at','updated_at'];

    // public function getCustomAttributeName() {
    //     return $this->attributes['type'] == 'something';
    // }
    // protected $appends = ['custom_attribute_name'];
}
