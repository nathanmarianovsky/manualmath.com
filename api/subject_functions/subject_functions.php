<?php

require_once $_SERVER["DOCUMENT_ROOT"] . "/api/classes/subject.php";

/*

Purpose:
Returns an array of all the subject(s) associated to a given parameter without all of
the relevant examples, sections, and topics.

Parameters:
	sid: 
		Gives a unique single subject
	sname: 
		Gives a unique single subject
	no parameter: 
		Gives all subjects in the database

Note:
If there are no subjects found, then an empty array is returned.

*/
function get_subjects($con, $args) {
	$subjects = array();

	if(isset($args["sid"])) {
		$sid = $args["sid"];
		$sql = $con->prepare("SELECT sname,`order` FROM subject WHERE sid=?");
		$sql->bind_param("i", $sid);
		$sql->bind_result($sname, $order);
		$sql->execute();
		$sql->fetch();
		$sql->close();

		if(isset($sname) && isset($order)) {
			$tmp = new Subject();
			$tmp->populate($sid, $sname, [], $order);
			$subjects[] = $tmp->expose();
		}
		
	}

	else if(isset($args["sname"])) {
		$sname = $args["sname"];
		$sql = $con->prepare("SELECT sid,`order` FROM subject WHERE sname=?");
		$sql->bind_param("s", $sname);
		$sql->bind_result($sid, $order);
		$sql->execute();
		$sql->fetch();
		$sql->close();

		if(isset($sid) && isset($order)) {
			$tmp = new Subject();
			$tmp->populate($sid, $sname, [], $order);
			$subjects[] = $tmp->expose();
		}
		
	}

	else {
		$sql = $con->prepare("SELECT sid,sname,`order` FROM subject ORDER BY `order` ASC");
		$sql->bind_result($sid, $sname, $order);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($sid) && isset($sname) && isset($order)) {
				$tmp = new Subject();
				$tmp->populate($sid, $sname, [], $order);
				$subjects[] = $tmp->expose();
			}
		}
		$sql->close();
	}

	return $subjects;
}

/*

Purpose:
Returns the contents associated to the subject

Parameters:
	tid: 
		Gives the contents of the unique subject

*/
function get_subject_data($con, $args) {
	if(isset($args["sid"])) {
		$sid = $args["sid"];
		$sql = $con->prepare("SELECT about,notation FROM subject WHERE sid=?");
		$sql->bind_param("i", $sid);
		$sql->bind_result($about, $notation);
		$sql->execute();
		$sql->fetch();
		$sql->close();
		class Info {
			public $about;
			public $notation;

			function __construct($_about, $_notation) {
				$this->about = $_about;
				$this->notation = $_notation;
			}
		}
		$obj = new Info($about, $notation);
		return $obj;
	}
	else { return "There was no sid passed in as a parameter!"; }
}

?>