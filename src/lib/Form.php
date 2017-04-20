<?php

namespace Uomi;

use \Respect\Validation\Validator;
use \Respect\Validation\Exceptions\ValidationException;
use \Respect\Validation\Exceptions\NestedValidationException;

class Form {

	private $name;
	private $fields;
	private $errors;

	function __construct(string $name) {
		$this->name = $name;
		$this->fields = [];
		$this->errors = [];
	}

	public function addField(Field $field) {
		array_push($this->fields, $field);
	}

	public function submit(array $data): array {
		$isGood = true;
		$result = [];
		foreach ($this->fields as $field) {

			if(isset($data[$field->name]) && isset($field->validator)) {
				// The field is set and it should be validated.
				try {
					$field->validator->assert($data[$field->name]);
				} catch(NestedValidationException $exception) {
					$isGood = false;
					$this->errors = array_merge($this->errors, $exception->getMessages());
				}
			}

			if(isset($data[$field->name])) {
				// The field is set, whether or not it needs validation.
				$result[$field->name] = $data[$field->name];

			} elseif(!isset($data[$field->name]) && $field->isRequired) {
				// The field is unset and is required.
				$isGood = false;
				array_push($this->errors, "$field->humanName is a required field.");
			} else {
				// unset, and optional. Do nothing.
			}
		}

		if($isGood) {
			return $result;
		} else {
			throw new \RuntimeException('There was an error in the submitted information.');
		}
	}

	public function getErrors(): array {
		return $this->errors;
	}

}
