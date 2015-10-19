<?php

require_once $_SERVER["DOCUMENT_ROOT"] . "/api/classes/api_physical.php";

if(!array_key_exists("HTTP_ORIGIN", $_SERVER)) {
    $_SERVER["HTTP_ORIGIN"] = $_SERVER["SERVER_NAME"];
}

try {
    $API = new MyAPI($_REQUEST["request"]);
    echo $API->processAPI();
} 
catch(Exception $e) {
    echo json_encode(Array("error" => $e->getMessage()));
}

?>