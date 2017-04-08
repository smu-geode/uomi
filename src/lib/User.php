<?php
    namespace Uomi;
    class User extends \Illuminate\Database\Eloquent\Model {

		// wrap the password field (passed in by $value)
		// in a HashedPassword object.
        public function getPasswordAttribute($value) {
            return HashedPassword::withHash($value, $this->salt);
        }

        // public function models() {
        //     return $this->hasMany('Uomi\Model','foreign_key_in_user');
        // }

		// Cast these columns before sending to the API
        // protected $casts = [
        //     'validated' => 'boolean',
        // ];

		// Hide this information from the API
        protected $hidden = ['password','salt','created_at','updated_at'];

        // public function getCustomAttributeName() {
        //     return $this->attributes['type'] == 'something';
        // }
        // protected $appends = ['custom_attribute_name'];
    }