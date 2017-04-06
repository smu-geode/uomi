<?php
namespace Uomi;
class StatusContainer {
    public $status = 'success';
    public $data = [];
    public $message = '';
    function __construct($data = null) {
        $this->data = $data ?? [];
    } // __construct
    public function success() {
        $this->status = 'success';
        if(isset($this->type)) {
            unset($this->type);
        }
    }
    public function error($type = null) {
        $this->status = 'error';
        $this->type = $type ?? 'None';
    }
    public function message(string $message) {
        $this->message = $message;
    }
}
