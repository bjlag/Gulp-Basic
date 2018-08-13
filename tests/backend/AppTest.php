<?php

namespace Tests;

use App\App;
use PHPUnit\Framework\TestCase;

class AppTest extends TestCase
{
    public function testHello()
    {
        $class = new App();
        $this->assertEquals( 'hello, wold!', $class->hello() );
    }
}