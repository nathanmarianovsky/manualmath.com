<?php

$mysql_hostname = "localhost";
$mysql_user = "user";
$mysql_password = "password";
$mysql_database = "database";

$db = new MySQLi($mysql_hostname, $mysql_user, $mysql_password, $mysql_database) or die ("Opps something went wrong");

?>