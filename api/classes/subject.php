<?php

include "topic.php";

class Subject {
	private $sname;
	private $sid;
	private $topics;
	private $clean_name;
	private $order;

	public function populate($_sid, $_sname, $_topics, $_order = 0) {
		$this->sid = $_sid;
		$this->sname = $_sname;
		$this->order = $_order;
		$tmp = str_replace("COLON", ": ", $_sname);
		$tmp = str_replace("AND", "-", $tmp);
		$tmp = str_replace("APOSTROPHE", "'", $tmp);
		$this->clean_name = str_replace("_", " ", $tmp);
		foreach($_topics as $tmp) {
			$this->topics[] = $tmp;
		}
	}

	public function get_topics() { return $this->topics; }

	public function get_name() { return $this->sname; }

	public function get_clean_name() { return $this->clean_name; }

	public function get_id() { return $this->sid; }

	public function get_order() { return $this->order; }

	public function expose() {
		$subject = get_object_vars($this);
		if(sizeof($this->topics) > 0) {
			$subject["topics"] = array_map(function($topic){ return $topic->expose(); }, $subject["topics"]);
		}
		return $subject;
	}
}

?>