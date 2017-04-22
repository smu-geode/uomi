<?php

namespace Uomi;

use \Respect\Validation\Validator;

class Field {

	public $humanName;
	public $name;
	public $isRequired;
	public $validator;

	protected function __construct($humanName = 'Untitled', $name = 'untitled', $isRequired = false, $validator = null) {
		$this->humanName = $humanName;
		$this->name = $name;
		$this->isRequired = $isRequired;
		$this->validator = $validator;
	}

	public static function make(): Field {
		return new Field();
	}

	function name(string $humanName, string $name): Field {
		return new Field($humanName, $name, $this->isRequired, $this->validator);
	}

	function required(): Field {
		return new Field($this->humanName, $this->name, true);
	}

	function optional(): Field {
		return new Field($this->humanName, $this->name, false);
	}

	function validated(Validator $v): Field {
		return new Field($this->humanName, $this->name, $this->isRequired, $v->setName($this->name));
	}
}
