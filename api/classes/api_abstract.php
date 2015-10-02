<?php

abstract class API {
    protected $method = '';
    protected $endpoint = '';
    protected $verb = '';
    protected $args = Array();
    protected $file = Null;

    private function _cleanInputs($data) {
        $clean_input = Array();

        if(is_array($data)) {
            foreach($data as $k => $v) {
                $clean_input[$k] = $this->_cleanInputs($v);
            }
        } 
        else {
            $clean_input = trim(strip_tags($data));
        }

        return $clean_input;
    }

    public function __construct($request) {
        header('Access-Control-Allow-Orgin: *');
        header('Access-Control-Allow-Methods: *');
        header('Content-Type: application/json');

        $this->args = explode('/', rtrim($request, '/'));
        $this->endpoint = array_shift($this->args);
        if(array_key_exists(0, $this->args) && !is_numeric($this->args[0])) {
            $this->verb = $this->args[0];
        }

        $this->method = $_SERVER['REQUEST_METHOD'];
        if($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
            if($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
                $this->method = 'DELETE';
            }
            else if($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
                $this->method = 'PUT';
            } 
            else {
                throw new Exception('Unexpected Header');
            }
        }

        if($this->method == 'POST') {
            $this->request = $this->_cleanInputs($_POST);
        }
        else if($this->method == 'GET') {
            $this->request = $this->_cleanInputs($_GET);
        }
        else if($this->method == 'PUT') {
            $this->request = $this->_cleanInputs($_GET);
            $this->file = file_get_contents('php://input');
        }
        else {
            $this->_response('Invalid Method', 405);
        }
    }

    private function _requestStatus($code) {
        $status = array(  
            100 => 'Continue',
            101 => 'Switching Protocols',
            102 => 'Processing',
            200 => 'OK',
            201 => 'Created',
            202 => 'Accepted',
            203 => 'Non-Authoritative Information',
            204 => 'No Content', 
            205 => 'Reset Content',
            206 => 'Partial Content',
            207 => 'Multi-Status',
            208 => 'Already Reported',
            226 => 'IM Used',
            300 => 'Multiple Choices',
            301 => 'Moved Permanently',
            302 => 'Found',
            303 => 'See Other',
            304 => 'Not Modified',
            305 => 'Use Proxy',
            307 => 'Temporary Redirect',
            308 => 'Permanent Redirect',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            402 => 'Payment Required',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            406 => 'Not Acceptable',
            407 => 'Proxy Authentication Required',
            408 => 'Request Timeout',
            409 => 'Conflict',
            410 => 'Gone',
            411 => 'Length Required',
            412 => 'Precondition Failed',
            413 => 'Payload Too Large',
            414 => 'URI Too Long',
            415 => 'Unsupported Media Type',
            416 => 'Range Not Satisfiable',
            417 => 'Expectation Failed',
            421 => 'Misdirected Request',
            422 => 'Unprocessable Entity',
            423 => 'Locked',
            424 => 'Failed Dependency', 
            426 => 'Upgrade Required',
            428 => 'Precondition Required',
            429 => 'Too Many Requests',
            431 => 'Request Header Fields Too Large',
            500 => 'Internal Server Error',
            501 => 'Not Implemented',
            502 => 'Bad Gateway',
            503 => 'Service Unavailable',
            504 => 'Gateway Timeout',
            505 => 'HTTP Version Not Supported',
            506 => 'Variant Also Negotiates',
            507 => 'Insufficient Storage',
            508 => 'Loop Detected',
            510 => 'Not Extended',
            511 => 'Network Authentication Required'
        ); 
        return ($status[$code]) ? $status[$code] : $status[500]; 
    }

    private function _response($data, $status = 200) {
        header('HTTP/1.1 ' . $status . ' ' . $this->_requestStatus($status));
        return json_encode($data);
    }

    public function processAPI() {
        if(method_exists($this, $this->endpoint)) {
            return $this->_response($this->{$this->endpoint}($this->args));
        }
        return $this->_response("No Endpoint: $this->endpoint", 404);
    }
}

?>