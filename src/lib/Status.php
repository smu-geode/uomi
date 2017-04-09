<?php
// Represents the status of an API request: used to wrap responses to API clients.
// Instead of returning an object `data` directly in the body, we return
// { "isError": false, "data": { `data` }, "message": "...", "type": "..." }
// Where message is a human readable status message that can be non-empty

namespace \Uomi;

use \stdClass;

class Status {
    private $isError;
    private $data;
    private $message;
    private $type;

    function __construct($data = null, $message = null, $isError = false, $type = null) {
        $this->data = $data ?? new stdClass; // empty object
        $this->message = $message;
        $this->isError = $isError;
        $this->type = $type;
    }

    public function noError(): StatusContainer {
        return new StatusContainer($this->data, $this->message, false, null);
    }

    public function error($type = null): StatusContainer {
        return new StatusContainer($this->data, $this->message, true, $type);
    }

    public function message(string $message): StatusContainer {
        return new StatusContainer($this->data, $message, $this->isError, $this->type);
    }

    public function data(object $data): StatusContainer {
        return new StatusContainer($data, $this->message, $this->isError, $this->type);
    }
}
