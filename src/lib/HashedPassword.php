<?php

namespace Uomi;

class HashedPassword {
    private $salt;
    private $hash;
	public function __construct() { /* nothing */ }

	// makeFromPlainText($plain: string) -> HashedPassword
	public static function makeFromPlainText(string $plain): HashedPassword {
		$c = new self();
		$c->setSalt( $c->generateSalt() );
		$c->setHash( $c->computeHash($plain) );
		return $c;
	}

    // makeFromPlainText($plain: string) -> HashedPassword
	public static function makeFromPlainTextWithSalt(string $plain, string $salt): HashedPassword {
		$c = new self();
		$c->setSalt( $salt );
		$c->setHash( $c->computeHash($plain) );
		return $c;
	}

    // withHash($hash: string, $salt: string) -> HashedPassword
    public static function withHash(string $hash, string $salt): HashedPassword {
        $c = new self();
        $c->setHash($hash);
        $c->setSalt($salt);
        return $c;
    }

    // compare($aC: HashedPassword, $bC: HashedPassword) -> bool
    public static function compare(HashedPassword $aC, HashedPassword $bC): bool {
        // Get the two underlying hashes
        $a = $aC->getHash();
        $b = $bC->getHash();
        // perform a time attack resistant comparison
        $ret = strlen($a) ^ strlen($b);
        $ret |= array_sum(unpack('C*', $a ^ $b));
        return !$ret;
    }

    // generateSalt() -> string
    private function generateSalt(): string {
        $salt = random_bytes(32);
        $salt = bin2hex($salt);
        return $salt;
    }

    // computeHash($plain: string) -> string
    private function computeHash(string $plain): string {
        // Iteratively apply the SHA 512
        // hash on the password, appending
        // both the salt and the original
        // password to prevent collision.
        $iterations = 100;
        $result = hash('sha512', $plain.$this->salt);
        for ($i = 0; $i < $iterations; ++$i) {
            $result = hash('sha512', $result.$this->salt.$plain);
        }
        return $result;
    } // end computeHash

    public function getHash(): string {
        return $this->hash;
    }

    public function getSalt(): string {
        return $this->salt;
    }

    public function setHash(string $h) {
        $this->hash = $h;
    }

    public function setSalt(string $s) {
        $this->salt = $s;
    }
} // end HashedPassword
