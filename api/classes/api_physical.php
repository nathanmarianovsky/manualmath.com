<?php

require_once "api_abstract.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/config.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/subject_functions/subject_functions.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/topic_functions/topic_functions.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/section_functions/section_functions.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/example_functions/example_functions.php";

class MyAPI extends API {
    public function __construct($request) {
        parent::__construct($request);
    }

    protected function example() {
        global $db;
        $params = array();

        if($this->method == "GET") {
            if(sizeof($this->args) == 2) {
                if($this->args[0] == "data") {
                    $main_arg = $this->args[1];
                    if(is_numeric($main_arg)) {
                        $params["eid"] = $main_arg;
                        return get_example_data($db, $params);
                    }
                    else { return "The eid you passed in is not a number!"; }
                }
                else {
                    $this->args[0] == "id" ? $type = "id" : $type = "name";
                    $main_arg = $this->args[1];
                    if($type == "id") { $params["eid"] = $main_arg; }
                    else if($type == "name") { $params["ename"] = $main_arg; }
                    else { return "The type of parameter you are passing in is not valid!"; }
                    return get_examples($db, $params);
                }
            }
            else { return "The number of parameters is not correct!"; }
        }
        else { return "This only accepts GET requests!"; }
    }

    protected function examples() {
        global $db;
        $params = array();

        if($this->method == "GET") {
            if(sizeof($this->args) == 0) {
                return get_examples($db, $params);
            }
            else { return "This returns all sections, therefore no parameters are taken!"; }
        }
        else { return "This only accepts GET requests!"; }
    }

    protected function section() {
        global $db;
        $params = array();

        if($this->method == "GET") {
            if(sizeof($this->args) == 2) {
                if($this->args[0] == "data") {
                    $main_arg = $this->args[1];
                    if(is_numeric($main_arg)) {
                        $params["section_id"] = $main_arg;
                        return get_section_data($db, $params);
                    }
                    else { return "The id you passed in is not a number!"; }
                }
                else {
                    $this->args[0] == "id" ? $type = "id" : $type = "name";
                    $main_arg = $this->args[1];
                    if($type == "id") { $params["section_id"] = $main_arg; }
                    else if($type == "name") { $params["section_name"] = $main_arg; }
                    else { return "The type of parameter you are passing in is not valid!"; }
                    return get_sections($db, $params);
                }
            }
            else { return "The number of parameters is not correct!"; }
        }
        else { return "This only accepts GET requests!"; }
    }

    protected function sections() {
        global $db;
        $params = array();

        if($this->method == "GET") {
            if(sizeof($this->args) == 0) {
                return get_sections($db, $params);
            }
            else { return "This returns all sections, therefore no parameters are taken!"; }
        }
        else { return "This only accepts GET requests!"; }
    }

    protected function topic() {
        global $db;
        $params = array();

        if($this->method == "GET") {
            if(sizeof($this->args) == 2) {
                if($this->args[0] == "data") {
                    $main_arg = $this->args[1];
                    if(is_numeric($main_arg)) {
                        $params["tid"] = $main_arg;
                        return get_topic_data($db, $params);
                    }
                    else { return "The id you passed in is not a number!"; }
                }
                else {
                    $this->args[0] == "id" ? $type = "id" : $type = "name";
                    $main_arg = $this->args[1];
                    if($type == "id") { $params["tid"] = $main_arg; }
                    else if($type == "name") { $params["tname"] = $main_arg; }
                    else { return "The type of parameter you are passing in is not valid!"; }
                    return get_topics($db, $params);
                }
            }
            else { return "The number of parameters is not correct!"; }
        }
        else { return "This only accepts GET requests!"; }
    }

    protected function topics() {
        global $db;
        $params = array();

        if($this->method == "GET") {
            if(sizeof($this->args) == 0) {
                return get_topics($db, $params);
            }
            else { return "This returns all topics, therefore no parameters are taken!"; }
        }
        else { return "This only accepts GET requests!"; }
    }

    protected function subject() {
        global $db;
        $params = array();

        if($this->method == "GET") {
            if(sizeof($this->args) == 2) {
                if($this->args[0] == "data") {
                    $main_arg = $this->args[1];
                    if(is_numeric($main_arg)) {
                        $params["sid"] = $main_arg;
                        return get_subject_data($db, $params);
                    }
                    else { return "The id you passed in is not a number!"; }
                }
                else {
                    $this->args[0] == "id" ? $type = "id" : $type = "name";
                    $main_arg = $this->args[1];
                    if($type == "id") { $params["sid"] = $main_arg; }
                    else if($type == "name") { $params["sname"] = $main_arg; }
                    else { return "The type of parameter you are passing in is not valid!"; }
                    return get_subjects($db, $params);
                }
            }
            else { return "The number of parameters is not correct!"; }
        }
        else { return "This only accepts GET requests!"; }
    }

    protected function subjects() {
        global $db;
        $params = array();

        if($this->method == "GET") {
            if(sizeof($this->args) == 0) {
                return get_subjects($db, $params);
            }
            else { return "This returns all subjects, therefore no parameters are taken!"; }
        }
        else { return "This only accepts GET requests!"; }
    }

    protected function delete() {
        global $db;
        $params = array();

        if($this->method == "POST") {
            if(sizeof($this->args) == 2) {
                $type = $this->args[0];
                $main_arg = $this->args[1];
                if(is_numeric($main_arg)) {
                    if($type == "subject") {
                        $params["sid"] = $main_arg;
                        return delete_subject($db, $params);
                    }
                    else if($type == "topic") {
                        $params["tid"] = $main_arg;
                        return delete_topic($db, $params);
                    }
                    else if($type == "section") {
                        $params["section_id"] = $main_arg;
                        return delete_section($db, $params);
                    }
                    else if($type == "example") {
                        $params["eid"] = $main_arg;
                        return delete_example($db, $params);
                    }
                    else { return "No such object exists in the database!"; }
                }
                else { return "The associated id needs to be a numerical value!"; }
            }
            else { return "This requires two parameters: the object type and associated id!"; }
        }
        else { return "This only accepts POST requests!"; }
    }
 }

 ?>