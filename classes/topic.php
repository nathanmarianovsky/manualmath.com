<?php

include "section.php";

class Topic {
	private $sid;
	private $tid;
	private $tname;
	private $clean_name;
	private $sections;
	private $order;

	public function populate($_sid, $_tid, $_tname, $_sections, $_order) {
		$this->sid = $_sid;
		$this->tid = $_tid;
		$this->tname = $_tname;
		$this->order = $_order;
		$this->clean_name = str_replace("_", " ", $_tname);
		$holder = NULL;
		for($i = 0; $i < sizeof($_sections); $i++) {
			$this->sections[] = $_sections[$i];
		}
	}

	public function get_name() { return $this->topic_name; }

	public function get_clean_name() { return $this->clean_name; }

	public function get_subject_id() { return $this->sid; }

	public function get_id() { return $this->tid; }

	public function get_sections() { return $this->sections; }

	public function get_order() { return $this->order; }

	public function expose() {
		$topic = get_object_vars($this);
		if(sizeof($topic['sections']) > 0) {
			$topic['sections'] = array_map(function($section){ return $section->expose(); }, $topic['sections']);
		}
		return $topic;
	}
}

?>