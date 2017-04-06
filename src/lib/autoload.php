<?php
// [CITE] https://gist.github.com/mageekguy/8300961
// PSR-4 Compliant autoloader
namespace Uomi;
spl_autoload_register(function($class) {
    if (stripos($class, __NAMESPACE__) === 0)
    {
        $file = __DIR__ . str_replace('\\', DIRECTORY_SEPARATOR, substr($class, strlen(__NAMESPACE__))) . '.php';
        @include($file);
    }
}
);
