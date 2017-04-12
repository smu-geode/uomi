<?php
// [CITE] https://gist.github.com/mageekguy/8300961
// PSR-4 Compliant autoloader
namespace Uomi;

// converts MyNamespace to my-namespace
function namespaceToFolderName(string $name): string {
    preg_match_all('!([A-Z][A-Z0-9]*(?=$|[A-Z][a-z0-9])|[A-Za-z][a-z0-9]+)!', $name, $matches);
    $ret = $matches[0];
    foreach ($ret as &$match) {
        $match = $match == strtoupper($match) ? strtolower($match) : lcfirst($match);
    }
    return implode('-', $ret);
}

// converts MyNested\Numerous\Namespaces to my-nested/numerous/namespaces
function namespaceArrayToPath(array $namespaceArray): string {
    $namespaceArray = array_map(function($x){
        return namespaceToFolderName($x);
    }, $namespaceArray);
    $namespaceDirectory = implode(DIRECTORY_SEPARATOR, $namespaceArray);
    return $namespaceDirectory;
}

$importDependency = function(string $dependency) {
    // $dependency is an absolute NS path to class without leading backslash.
    //
    //     Uomi\MyNamespace\Test
    //
    if (stripos($dependency, __NAMESPACE__) === 0) {
        
        // The namespace relative to the current namespace:
        //
        // Uomi\MyNamespace\Other\Test - Uomi => MyNamespace\Other\Test
        //
        $relativeNamespace = substr($dependency, strlen(__NAMESPACE__));
        
        //
        // ['MyNamespace', 'Other', 'Test']
        //
        $namespaceArray = explode('\\', $relativeNamespace);
        
        //
        // ['MyNamespace', 'Other'] ['Test']
        //
        $className = array_pop($namespaceArray);
        
        //
        // ['MyNamespace', 'Other'] => '/my-namespace/other'
        //
        $relativePath = namespaceArrayToPath($namespaceArray);
        
        //
        // '/path/to/project/src/lib/my-namespace/other/Test.php'
        //
        $file = __DIR__ . $relativePath . DIRECTORY_SEPARATOR . $className . '.php';
        @include($file);
    }
};

spl_autoload_register($importDependency);

