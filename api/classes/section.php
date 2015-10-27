<?php

include "example.php";

class Section {
	private $section_id;
	private $tid;
	private $section_name;
	private $clean_name;
	private $examples;
	private $order;

	public function populate($_section_id, $_tid, $_section_name, $_examples, $_order = 0) {
		$this->section_id = $_section_id;
		$this->tid = $_tid;
		$this->section_name = $_section_name;
		$this->order = $_order;
		$tmp = str_replace("COLON", ": ", $_section_name);
		$tmp = str_replace("AND", "-", $tmp);
		$tmp = str_replace("APOSTROPHE", "'", $tmp);
		$this->clean_name = str_replace("_", " ", $tmp);
		if(sizeof($_examples) > 0) {
			for($i = 0; $i < sizeof($_examples); $i++) {
				$this->examples[] = $_examples[$i];
			}
		}
		else {
			$this->examples = array();
		}
	}

	public function get_name() { return $this->section_name; }

	public function get_clean_name() { return $this->clean_name; }

	public function get_topic_id() { return $this->tid; }

	public function get_id() { return $this->section_id; }

	public function get_examples() { return $this->examples; }

	public function get_order() { return $this->order; }

	public function expose() {
		$section = get_object_vars($this);
		if(sizeof($this->examples) > 0) {
			$section["examples"] = array_map(function($example){ return $example->expose(); }, $section["examples"]);
		}
		return $section;
	}
}

?>