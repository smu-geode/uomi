<?php
// $env = require __DIR__ . '/../env.php';
return [
    'settings' => [
        'debug' => $env['UOMI_DEBUG'],
        'logger' => [
            'name' => 'uomi',
            'path' => '../logs/api.log',
        ],
        // Eloquent settings
        /*'eloquent' => [
            'driver' => 'mysql',
            'host' => $env['UOMI_DB_HOST'],
            'database' => $env['UOMI_DB_NAME'],
            'username' => $env['UOMI_DB_USERNAME'],
            'password' => $env['UOMI_DB_PASSWORD'],
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_general_ci',
            'prefix' => '',
        ]*/
    ],
];
