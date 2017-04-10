<?php

require 'vendor/autoload.php';
require 'lib/autoload.php';

$settings = require 'slim/settings.php';
$app = new \Slim\App($settings);
require 'slim/dependencies.php';
require 'slim/middleware.php';
require 'slim/errors.php';

$c = $app->getContainer();
\Uomi\registerErrorHandlers($c);

// Setup Eloquent
$capsule = new \Illuminate\Database\Capsule\Manager;
$capsule->addConnection($settings['settings']['eloquent']);
use Illuminate\Container\Container;
$capsule->setAsGlobal();
$capsule->bootEloquent();

require 'slim/routes.php';
$app->run();
