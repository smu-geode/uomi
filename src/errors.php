<?php

namespace Uomi;

function registerErrorHandlers(\Slim\Container $c) {
	// Exceptions get sent through this handler
	$c['errorHandler'] = function ($c) {
	    return function ($request, $response, $exception) use ($c) {
	        $c->get('logger')->error("[Exception] ".$exception->getMessage());
	        $stat = new \Uomi\StatusContainer();
	        $stat->error("ObfuscatedInternalServerError");
	        $stat->message("Something went wrong on our side!");
	        if($c->get('settings')['debug']) {
	            $stat->data = [
	                'type' => get_class($exception),
	                'errorMessage' => $exception->getMessage(),
	                'line' => $exception->getLine(),
	                'file' => $exception->getFile(),
	                'trace' => $exception->getTrace()
	            ];
	        }
	        return $response->withStatus(500)
	                        ->withJson($stat);
	    };
	};
	// PHP 7 Error objects get sent through this handler
	$c['phpErrorHandler'] = function ($c) {
	    return function ($request, $response, $exception) use ($c) {
	        $c->get('logger')->error("[PHP Error] ".$exception->getMessage());
	        $stat = new \Uomi\StatusContainer();
	        $stat->error("ObfuscatedInternalServerError");
	        $stat->message("Something went wrong on our side!");
	        if($c->get('settings')['debug']) {
	            $stat->data = [
	                'type' => get_class($exception),
	                'errorMessage' => $exception->getMessage(),
	                'line' => $exception->getLine(),
	                'file' => $exception->getFile(),
	                'trace' => $exception->getTrace()
	            ];
	        }
	        return $response->withStatus(500)
	                        ->withJson($stat);
	    };
	};

}
