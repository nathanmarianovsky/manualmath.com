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
Returns the content associated to the subject

Parameters:
	sid: 
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

/*

Purpose:
Deletes a subject in the database. Return 1 for success and 0 for failure.

Parameters:
	sid: 
		Deletes the unique subject and all of its associated attributes

*/
function delete_subject($con, $args) {
	if(isset($args["sid"])) {
		$sid = $args["sid"];
		$sql = $con->prepare("SELECT sid FROM subject");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $sid) {
					$sql->close();
					$sql = $con->prepare("DELETE FROM subject WHERE sid=?");
					$sql->bind_param("i", $sid);
					$sql->execute();
					$sql->fetch();
					$sql->close();
					return "1";
				}
			}
		}
		$sql->close();
		return "0";
	}
	else { return "There was no sid passed in as a parameter!"; }
}

/*

Purpose:
Adds a subject to the database. Return 1 for success and 0 for failure.

Parameters:
	sid: 
		Adds the unique subject and all of its associated attributes

*/
function add_subject($con, $args) {
	if(isset($args["sid"]) && isset($args["sname"]) && isset($args["order"]) && isset($args["about"]) && isset($args["notation"])) {
		$sid = $args["sid"];
		$sname = $args["sname"];
		$order = $args["order"];
		$about = $args["about"];
		$notation = $args["notation"];
		$sql = $con->prepare("SELECT sid FROM subject");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $sid) {
					$sql->close();
					return "0";
				}
			}
		}
		$sql->close();
		$sql = $con->prepare("INSERT INTO subject (sid,sname,`order`,about,notation) VALUES (?,?,?,?,?)");
		$sql->bind_param("isiss", $sid, $sname, $order, $about, $notation);
		$sql->execute();
		$sql->fetch();
		$sql->close();
		return "1";
	}
	else { return "Some parameters are missing!"; }
}

?>