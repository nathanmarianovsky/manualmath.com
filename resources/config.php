<?php

$mysql_hostname = "localhost";
$mysql_user = "tmp";
$mysql_password = "mypassword";
$mysql_database = "website";

$db = new MySQLi($mysql_hostname, $mysql_user, $mysql_password, $mysql_database) or die ("Opps something went wrong");

?>