<?php

require 'vendor/autoload.php';
require 'lib/autoload.php';

$settings = require 'settings.php';
$app = new \Slim\App($settings);

require 'dependencies.php';
require 'middleware.php';
require 'errors.php';

$c = $app->getContainer();
\Uomi\registerErrorHandlers($c);

// Setup Eloquent
$capsule = new \Illuminate\Database\Capsule\Manager;
$capsule->addConnection($settings['settings']['eloquent']);
use Illuminate\Container\Container;
$capsule->setAsGlobal();
$capsule->bootEloquent();

require 'routes.php';
$app->run();
