<?php

require_once $_SERVER["DOCUMENT_ROOT"] . "/api/classes/example.php";

/*

Purpose:
Returns an array of all the example(s) associated to a given parameter.

Parameters:
	sid: 
		Gives all examples under all the sections and all the topics of the subject
	sname: 
		Gives all examples under all the sections and all the topics of the subject
	tid: 
		Gives all examples under all the sections of the topic
	tname: 
		Gives all examples under all the sections of the topic(s)
	section_id: 
		Gives all examples under the section
	section_name: 
		Gives all examples under the section(s)
	eid: 
		Gives a single unique example
	ename: 
		Gives all examples with this name
	no parameter: 
		Gives all examples in the database

Note:
If there are no examples found, then an empty array is returned.

*/
function get_examples($con, $args) {
	$examples = array();

	if(isset($args["eid"])) {
		$eid = $args["eid"];
		$sql = $con->prepare("SELECT section_id,ename,`order` FROM example WHERE eid=?");
		$sql->bind_param("i", $eid);
		$sql->bind_result($section_id, $ename, $order);
		$sql->execute();
		$sql->fetch();
		$sql->close();

		if(isset($section_id) && isset($ename) && isset($order)) {
			$tmp = new Example();
			$tmp->populate($eid, $section_id, $ename, $order);
			$examples[] = $tmp->expose();
		}
	}

	else if(isset($args["ename"])) {
		$ename = $args["ename"];
		$sql = $con->prepare("SELECT eid,section_id,`order` FROM example WHERE ename=?");
		$sql->bind_param("s", $ename);
		$sql->bind_result($eid, $section_id, $order);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($eid) && isset($section_id) && isset($order)) {
				$tmp = new Example();
				$tmp->populate($eid, $section_id, $ename, $order);
				$examples[] = $tmp->expose();
			}
		}
		$sql->close();
	}

	else {
		$sql = $con->prepare("SELECT eid,ename,section_id,`order` FROM example");
		$sql->bind_result($eid, $ename, $section_id, $order);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($eid) && isset($ename) && isset($section_id) && isset($order)) {
				$tmp = new Example();
				$tmp->populate($eid, $section_id, $ename, $order);
				$examples[] = $tmp->expose();
			}
		}
		$sql->close();
	}

	return $examples;
}

/*

Purpose:
Returns the content associated to the example

Parameters:
	eid: 
		Gives the contents of the unique example

*/
function get_example_data($con, $args) {
	if(isset($args["eid"])) {
		$eid = $args["eid"];
		$sql = $con->prepare("SELECT problem,solution FROM example WHERE eid=?");
		$sql->bind_param("i", $eid);
		$sql->bind_result($problem, $solution);
		$sql->execute();
		$sql->fetch();
		$sql->close();
		class Info {
			public $problem;
			public $solution;

			function __construct($_problem, $_solution) {
				$this->problem = $_problem;
				$this->solution = $_solution;
			}
		}
		$obj = new Info($problem, $solution);
		return $obj;
	}
	else { return "There was no eid passed in as a parameter!"; }
}

/*

Purpose:
Deletes the example in the database. Return 1 for success and 0 for failure.

Parameters:
	sid: 
		Deletes the unique example and all of its associated attributes

*/
function delete_example($con, $args) {
	if(isset($args["eid"])) {
		$eid = $args["eid"];
		$sql = $con->prepare("SELECT eid FROM example");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $eid) {
					$sql->close();
					$sql = $con->prepare("DELETE FROM example WHERE eid=?");
					$sql->bind_param("i", $eid);
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
	else { return "There was no eid passed in as a parameter!"; }
}

/*

Purpose:
Adds an example to the database. Return 1 for success and 0 for failure.

Parameters:
	sid: 
		Adds the unique example and all of its associated attributes

*/
function add_example($con, $args) {
	if(isset($args["eid"]) && isset($args["ename"]) && isset($args["order"]) && isset($args["section_id"]) && isset($args["problem"]) && isset($args["solution"])) {
		$eid = $args["eid"];
		$ename = $args["ename"];
		$order = $args["order"];
		$section_id = $args["section_id"];
		$problem = $args["problem"];
		$solution = $args["solution"];
		$sql = $con->prepare("SELECT eid FROM example");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $eid) {
					$sql->close();
					return "0";
				}
			}
		}
		$sql = $con->prepare("SELECT section_id FROM section");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $section_id) {
					$sql->close();
					$sql = $con->prepare("INSERT INTO example (eid,ename,`order`,section_id,problem,solution) VALUES (?,?,?,?,?,?)");
					$sql->bind_param("isiiss", $eid, $ename, $order, $section_id, $problem, $solution);
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
	else { return "Some parameters are missing!"; }
}

?>