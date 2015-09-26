<?php

require_once 'api_abstract.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/resources/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . "/api/subject_functions/subject_functions.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/api/topic_functions/topic_functions.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/api/section_functions/section_functions.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/api/example_functions/example_functions.php";

class MyAPI extends API {
    public function __construct($request) {
        parent::__construct($request);
    }

    protected function examples() {
        global $db;
        $params = array();

        if($this->method == 'GET') {
            if(sizeof($this->args) == 0) {
                return get_examples($db, $params);
            }
            else if(sizeof($this->args) == 3) {
                $type = $this->args[0];
                $id = $this->args[1] == 'id';
                $name = $this->args[1] == 'name';
                $main_arg = $this->args[2];
                if($id) {
                    if($type == 'example') {
                        $params['eid'] = $main_arg;
                    }
                    else if($type == 'section') {
                        $params['section_id'] = $main_arg;
                    }
                    else if($type == 'topic') {
                        $params['tid'] = $main_arg;
                    }
                    else if($type == 'subject') {
                        $params['sid'] = $main_arg;
                    }
                    else {
                        return 'No such type exists';
                    }
                    return get_examples($db, $params);
                }
                else if($name) {
                    if($type == 'example') {
                        $params['ename'] = $main_arg;
                    }
                    else if($type == 'section') {
                        $params['section_name'] = $main_arg;
                    }
                    else if($type == 'topic') {
                        $params['tname'] = $main_arg;
                    }
                    else if($type == 'subject') {
                        $params['sname'] = $main_arg;
                    }
                    else {
                        return 'No such type exists';
                    }
                    return get_examples($db, $params);
                }
                else {
                    return 'This is not an accepted data type';
                }
            }
            else {
                return 'The number of parameters is not correct';
            }
        }
        else {
            return 'This only accepts GET requests';
        }
    }

    protected function get_example_file() {
        global $db;
        if($this->method == 'GET') {
            if(sizeof($this->args) == 1) {
                $main_arg = $this->args[0];
                $params = array();
                if(is_numeric($main_arg)) {
                    $params['eid'] = $main_arg;
                    return get_example_file($db, $params);
                }
                else {
                    return 'The eid has to be a numeric value';
                }
            }
            else {
                return 'The number of parameters is not correct';
            }
        }
        else {
            return 'This only accepts GET requests';
        }
    }

    protected function sections() {
        global $db;
        $params = array();

        if($this->method == 'GET') {
            if(sizeof($this->args) == 0) {
                return get_sections($db, $params);
            }
            else if(sizeof($this->args) == 3) {
                $type = $this->args[0];
                $id = $this->args[1] == 'id';
                $name = $this->args[1] == 'name';
                $main_arg = $this->args[2];
                if($id) {
                    if($type == 'section') {
                        $params['section_id'] = $main_arg;
                    }
                    else if($type == 'topic') {
                        $params['tid'] = $main_arg;
                    }
                    else if($type == 'subject') {
                        $params['sid'] = $main_arg;
                    }
                    else {
                        return 'No such type exists or is not accepted';
                    }
                    return get_sections($db, $params);
                }
                else if($name) {
                    if($type == 'section') {
                        $params['section_name'] = $main_arg;
                    }
                    else if($type == 'topic') {
                        $params['tname'] = $main_arg;
                    }
                    else if($type == 'subject') {
                        $params['sname'] = $main_arg;
                    }
                    else {
                        return 'No such type exists or is not accepted';
                    }
                    return get_sections($db, $params);
                }
                else {
                    return 'This is not an accepted data type';
                }
            }
            else {
                return 'The number of parameters is not correct';
            }
        }
        else {
            return 'This only accepts GET requests';
        }
    }

    protected function get_section_file() {
        global $db;
        if($this->method == 'GET') {
            if(sizeof($this->args) == 1) {
                $main_arg = $this->args[0];
                $params = array();
                if(is_numeric($main_arg)) {
                    $params['section_id'] = $main_arg;
                    return get_section_file($db, $params);
                }
                else {
                    return 'The section_id has to be a numeric value';
                }
            }
            else {
                return 'The number of parameters is not correct';
            }
        }
        else {
            return 'This only accepts GET requests';
        }
    }

    protected function topics() {
        global $db;
        $params = array();

        if($this->method == 'GET') {
            if(sizeof($this->args) == 0) {
                return get_topics($db, $params);
            }
            else if(sizeof($this->args) == 3) {
                $type = $this->args[0];
                $id = $this->args[1] == 'id';
                $name = $this->args[1] == 'name';
                $main_arg = $this->args[2];
                if($id) {
                    if($type == 'topic') {
                        $params['tid'] = $main_arg;
                    }
                    else if($type == 'subject') {
                        $params['sid'] = $main_arg;
                    }
                    else {
                        return 'No such type exists or is not accepted';
                    }
                    return get_topics($db, $params);
                }
                else if($name) {
                    if($type == 'topic') {
                        $params['tname'] = $main_arg;
                    }
                    else if($type == 'subject') {
                        $params['sname'] = $main_arg;
                    }
                    else {
                        return 'No such type exists or is not accepted';
                    }
                    return get_topics($db, $params);
                }
                else {
                    return 'This is not an accepted data type';
                }
            }
            else {
                return 'The number of parameters is not correct';
            }
        }
        else {
            return 'This only accepts GET requests';
        }
    }

    protected function subjects() {
        global $db;
        $params = array();

        if($this->method == 'GET') {
            if(sizeof($this->args) == 0) {
                return get_subjects($db, $params);
            }
            else if(sizeof($this->args) == 3) {
                $type = $this->args[0];
                $id = $this->args[1] == 'id';
                $name = $this->args[1] == 'name';
                $main_arg = $this->args[2];
                if($id) {
                    if($type == 'subject') {
                        $params['sid'] = $main_arg;
                    }
                    else {
                        return 'No such type exists or is not accepted';
                    }
                    return get_subjects($db, $params);
                }
                else if($name) {
                    if($type == 'subject') {
                        $params['sname'] = $main_arg;
                    }
                    else {
                        return 'No such type exists or is not accepted';
                    }
                    return get_subjects($db, $params);
                }
                else {
                    return 'This is not an accepted data type';
                }
            }
            else {
                return 'The number of parameters is not correct';
            }
        }
        else {
            return 'This only accepts GET requests';
        }
    }
 }

 ?>