<?php

namespace Uomi;

function genericErrorHandler(string $header, \Slim\Container $c) {
	return function ($request, $response, $exception) use ($c, $header) {

		$c->get('logger')->error("[$header] ".$exception->getMessage());

		$info = [
			'type' => get_class($exception),
			'errorMessage' => $exception->getMessage(),
			'line' => $exception->getLine(),
			'file' => $exception->getFile(),
			'trace' => $exception->getTrace()
		];

		$c->get('logger')->error("[$header] ".json_encode($info));

		$data = new \stdClass();
		if($c->get('settings')['debug']) {
			$data = $info;
		}

		$stat = new \Uomi\Status($data);
		$stat = $stat->error("ObfuscatedInternalServerError")
					 ->message("Something went wrong on our side!");
		return $response->withStatus(500)->withJson($info);
	};
}

function registerErrorHandlers(\Slim\Container $c) {
	// Exceptions get sent through this handler
	$c['errorHandler'] = function ($c) {
		return genericErrorHandler('Exception', $c);
	};
	// PHP 7 Error objects get sent through this handler
	$c['phpErrorHandler'] = function ($c) {
		return genericErrorHandler('PHP Error', $c);
	};

}
