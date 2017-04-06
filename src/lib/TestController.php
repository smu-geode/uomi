<?php

namespace Uomi;

use Slim\Http\Request;
use Slim\Http\Response;
use \RuntimeException;
use \Exception;
use Slim\Container;

class TestController {

	private $container;
	private $logger;

	function __construct(Container $c) {
		$this->container = $c;
		$this->logger = $this->container->get('logger');
	}

	function __invoke(Request $req, Response $res): Response {
		return $this->testHandler($req, $res);
	}

	function testHandler(Request $req, Response $res): Response {
		switch($req->getMethod()) {
			case 'GET':
				return $this->getTestHandler($req, $res);
			default:
				return $res->withStatus(405); // Method Not Allowed
		}
	}

	function getTestHandler(Request $req, Response $res): Response {
		$data = [ 'message' => 'Hello, World!' ];
		$stat = new StatusContainer($data);
		$stat->success();
		return $res->withJson($stat);
	}
}
