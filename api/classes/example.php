<?php

class Example {
	private $eid;
	private $section_id;
	private $ename;
	private $clean_name;
	private $order;

	public function populate($_eid, $_section_id, $_ename, $_order = 0) {
		$this->eid = $_eid;
		$this->section_id = $_section_id;
		$this->ename = $_ename;
		$this->order = $_order;
		$tmp = str_replace("-", ": ", $_ename);
		$this->clean_name = str_replace("_", " ", $tmp);
	}

	public function get_name() { return $this->ename; }

	public function get_clean_name() { return $this->clean_name; }

	public function get_id() { return $this->eid; }

	public function get_order() { return $this->order; }

	public function expose() { return get_object_vars($this); }
}

?>