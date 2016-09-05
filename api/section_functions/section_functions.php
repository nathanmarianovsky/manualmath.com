<?php

require_once $_SERVER["DOCUMENT_ROOT"] . "/api/classes/section.php";

/*

Purpose:
Returns an array of all the section(s) associated to a given parameter without all of
the relevant examples.

Parameters:
	sid: 
		Gives all sections under all of the topics of the subject
	sname: 
		Gives all sections under all of the topics of the subject
	tid: 
		Gives all sections under the topic
	tname: 
		Gives all sections under the topic(s)
	section_id: 
		Gives a unique single section
	section_name: 
		Gives all sections with this name
	no parameter: 
		Gives all sections in the database

Note:
If there are no sections found, then an empty array is returned.

*/
function get_sections($con, $args) {
	$sections = array();

	if(isset($args["section_id"])) {
		$section_id = $args["section_id"];
		$sql = $con->prepare("SELECT section_name,tid,`order` FROM section WHERE section_id=?");
		$sql->bind_param("i", $section_id);
		$sql->bind_result($section_name, $tid, $order);
		$sql->execute();
		$sql->fetch();
		$sql->close();

		if(isset($section_name) && isset($tid) && isset($order)) {
			$tmp = new Section();
			$tmp->populate($section_id, $tid, $section_name, [], $order);
			$sections[] = $tmp->expose();
		}
	}

	else if(isset($args["section_name"])) {
		$section_name = $args["section_name"];
		$sql = $con->prepare("SELECT section_id,tid,`order` FROM section WHERE section_name=?");
		$sql->bind_param("s", $section_name);
		$sql->bind_result($section_id, $tid, $order);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($section_id) && isset($tid) && isset($order)) {
				$tmp = new Section();
				$tmp->populate($section_id, $tid, $section_name, [], $order);
				$sections[] = $tmp->expose();
			}
		}
		$sql->close();
	}

	else {
		$sql = $con->prepare("SELECT section_id,tid,section_name,`order` FROM section");
		$sql->bind_result($section_id, $tid, $section_name, $order);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($section_id) && isset($tid) && isset($section_name) && isset($order)) {
				$tmp = new Section();
				$tmp->populate($section_id, $tid, $section_name, [], $order);
				$section = $tmp->expose();
				$sections[] = $section;
			}
		}
		$sql->close();
	}

	return $sections;
}

/*

Purpose:
Returns the contents associated to the section

Parameters:
	section_id: 
		Gives the contents of the unique section

*/
function get_section_data($con, $args) {
	if(isset($args["section_id"])) {
		$section_id = $args["section_id"];
		$statement = "SELECT ";
		for($i = 1; $i < 10; $i++) {
			$statement .= "title" . $i . ",content" . $i . ","; 
		}
		$statement .= "title10,content10 FROM section WHERE section_id=?";
		$sql = $con->prepare($statement);
		$sql->bind_param("i", $section_id);
		$sql->bind_result($title1, $content1, $title2, $content2, $title3, $content3, $title4, $content4, $title5, $content5, $title6, $content6, $title7, $content7, $title8, $content8, $title9, $content9, $title10, $content10);
		$sql->execute();
		$sql->fetch();
		$sql->close();

		class Info {
			public $title1;
			public $title2;
			public $title3;
			public $title4;
			public $title5;
			public $title6;
			public $title7;
			public $title8;
			public $title9;
			public $title10;
			public $content1;
			public $content2;
			public $content3;
			public $content4;
			public $content5;
			public $content6;
			public $content7;
			public $content8;
			public $content9;
			public $content10;

			function __construct($_title1, $_content1, $_title2, $_content2, $_title3, $_content3, $_title4, $_content4, $_title5, $_content5, $_title6, $_content6, $_title7, $_content7, $_title8, $_content8, $_title9, $_content9, $_title10, $_content10) {
				$this->title1 = $_title1;
				$this->title2 = $_title2;
				$this->title3 = $_title3;
				$this->title4 = $_title4;
				$this->title5 = $_title5;
				$this->title6 = $_title6;
				$this->title7 = $_title7;
				$this->title8 = $_title8;
				$this->title9 = $_title9;
				$this->title10 = $_title10;
				$this->content1 = $_content1;
				$this->content2 = $_content2;
				$this->content3 = $_content3;
				$this->content4 = $_content4;
				$this->content5 = $_content5;
				$this->content6 = $_content6;
				$this->content7 = $_content7;
				$this->content8 = $_content8;
				$this->content9 = $_content9;
				$this->content10 = $_content10;
			}
		}
		$obj = new Info($title1, $content1, $title2, $content2, $title3, $content3, $title4, $content4, $title5, $content5, $title6, $content6, $title7, $content7, $title8, $content8, $title9, $content9, $title10, $content10);
		return $obj;
	}
	else { return "There was no section_id passed in as a parameter!"; }
}

?>