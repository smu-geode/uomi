<?php

namespace Uomi\Factory;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

use \Uomi\Model\Analytic;
use \Uomi\Status;
use \Uomi\Authentication;

class AnalyticFactory {

	private $container;

	function __construct(Container $c) {
		$this->container = $c;
	}

	public function track(Request $req) {
		$header = $req->getHeaders();

		$user_id = Authentication::getCurrentUserId($req);

		$host = null;
		$ip = $_SERVER['REMOTE_ADDR'];
		$user_agent = null;
		$language = null;
		
		foreach($header as $name => $value) {
			if($name == 'Host') {
				$host = reset($value) ?? NULL;
			}elseif($name == 'HTTP_USER_AGENT') {
				$user_agent = reset($value) ?? NULL;
			}elseif ($name == 'ACCEPT_LANGUAGE') {
				$language = reset($value) ?? NULL;
			}
		}
		
		$analytic = new Analytic();
		
		$analytic->user_id = $user_id;
		$analytic->host = $host;
		$analytic->ip = $ip;
		$analytic->user_agent = $user_agent;
		$analytic->accept_language = $language;
		
		$analytic->save();
	}
}
