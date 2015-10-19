<?php

require_once $_SERVER["DOCUMENT_ROOT"] . "/classes/example.php";

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
	$tmp_tid = array();
	$tmp_section_id = array();

	if(isset($args["sid"])) {
		$sid = $args["sid"];
		$sql = $con->prepare("SELECT tid FROM topic WHERE sid=?");
		$sql->bind_param("i", $sid);
		$sql->bind_result($tid);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($tid)) {
				$tmp_tid[] = $tid;
			}
		}
		$sql->close();

		if(sizeof($tmp_tid) > 0) {
			foreach($tmp_tid as $tid) {
				$sql = $con->prepare("SELECT section_id FROM section WHERE tid=?");
				$sql->bind_param("i", $tid);
				$sql->bind_result($section_id);
				$sql->execute();
				while($sql->fetch()) {
					if(isset($section_id)) {
						$tmp_section_id[] = $section_id;
					}
				}
				$sql->close();
			}

			if(sizeof($tmp_section_id) > 0) {
				foreach($tmp_section_id as $section_id) {
					$sql = $con->prepare("SELECT eid,ename,`order` FROM example WHERE section_id=?");
					$sql->bind_param("i", $section_id);
					$sql->bind_result($eid, $ename, $order);
					$sql->execute();
					while($sql->fetch()) {
						if(isset($eid) && isset($ename) && isset($order)) {
							$tmp = new Example();
							$tmp->populate($eid, $section_id, $ename, $order);
							$examples[] = $tmp->expose();
						}
					}
					$sql->close();
				}
			}
		}
	}

	else if(isset($args["sname"])) {
		$sname = $args["sname"];
		$sql = $con->prepare("SELECT sid FROM subject WHERE sname=?");
		$sql->bind_param("s", $sname);
		$sql->bind_result($sid);
		$sql->execute();
		$sql->fetch();
		$sql->close();

		if(isset($sid)) {
			$sql = $con->prepare("SELECT tid FROM topic WHERE sid=?");
			$sql->bind_param("i", $sid);
			$sql->bind_result($tid);
			$sql->execute();
			while($sql->fetch()) {
				if(isset($tid)) {
					$tmp_tid[] = $tid;
				}
			}
			$sql->close();

			if(sizeof($tmp_tid) > 0) {
				foreach($tmp_tid as $tid) {
					$sql = $con->prepare("SELECT section_id FROM section WHERE tid=?");
					$sql->bind_param("i", $tid);
					$sql->bind_result($section_id);
					$sql->execute();
					while($sql->fetch()) {
						if(isset($section_id)) {
							$tmp_section_id[] = $section_id;
						}
					}
					$sql->close();
				}

				if(sizeof($tmp_section_id) > 0) {
					foreach($tmp_section_id as $section_id) {
						$sql = $con->prepare("SELECT eid,ename,`order` FROM example WHERE section_id=?");
						$sql->bind_param("i", $section_id);
						$sql->bind_result($eid, $ename, $order);
						$sql->execute();
						while($sql->fetch()) {
							if(isset($eid) && isset($ename) && isset($order)) {
								$tmp = new Example();
								$tmp->populate($eid, $section_id, $ename, $order);
								$examples[] = $tmp->expose();
							}
						}
						$sql->close();
					}
				}
			}
		}
	}

	else if(isset($args["tid"])) {
		$tid = $args["tid"];
		$sql = $con->prepare("SELECT section_id FROM section WHERE tid=?");
		$sql->bind_param("i", $tid);
		$sql->bind_result($section_id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($section_id)) {
				$tmp_section_id[] = $section_id;
			}
		}
		$sql->close();

		if(sizeof($tmp_section_id) > 0) {
			foreach($tmp_section_id as $section_id) {
				$sql = $con->prepare("SELECT eid,ename,`order` FROM example WHERE section_id=?");
				$sql->bind_param("i", $section_id);
				$sql->bind_result($eid, $ename, $order);
				$sql->execute();
				while($sql->fetch()) {
					if(isset($eid) && isset($ename) && isset($order)) {
						$tmp = new Example();
						$tmp->populate($eid, $section_id, $ename, $order);
						$examples[] = $tmp->expose();
					}
				}
				$sql->close();
			}
		}
	}

	else if(isset($args["tname"])) {
		$tname = $args["tname"];
		$sql = $con->prepare("SELECT tid FROM topic WHERE tname=?");
		$sql->bind_param("s", $tname);
		$sql->bind_result($tid);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($tid)) {
				$tmp_tid[] = $tid;
			}	
		}
		$sql->close();

		if(sizeof($tmp_tid) > 0) {
			foreach($tmp_tid as $tid) {
				$sql = $con->prepare("SELECT section_id FROM section WHERE tid=?");
				$sql->bind_param("i", $tid);
				$sql->bind_result($section_id);
				$sql->execute();
				while($sql->fetch()) {
					if(isset($section_id)) {
						$tmp_section_id[] = $section_id;
					}
				}
				$sql->close();
			}

			if(sizeof($tmp_section_id) > 0) {
				foreach($tmp_section_id as $section_id) {
					$sql = $con->prepare("SELECT eid,ename,`order` FROM example WHERE section_id=?");
					$sql->bind_param("i", $section_id);
					$sql->bind_result($eid, $ename, $order);
					$sql->execute();
					while($sql->fetch()) {
						if(isset($eid) && isset($ename) && isset($order)) {
							$tmp = new Example();
							$tmp->populate($eid, $section_id, $ename, $order);
							$examples[] = $tmp->expose();
						}
					}
					$sql->close();
				}
			}
		}
	}

	else if(isset($args["section_id"])) {
		$section_id = $args["section_id"];
		$sql = $con->prepare("SELECT eid,ename,`order` FROM example WHERE section_id=?");
		$sql->bind_param("i", $section_id);
		$sql->bind_result($eid, $ename, $order);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($eid) && isset($ename) && isset($order)) {
				$tmp = new Example();
				$tmp->populate($eid, $section_id, $ename, $order);
				$examples[] = $tmp->expose();
			}
		}
		$sql->close();
	}

	else if(isset($args["section_name"])) {
		$section_name = $args["section_name"];
		$sql = $con->prepare("SELECT section_id FROM section WHERE section_name=?");
		$sql->bind_param("s", $section_name);
		$sql->bind_result($section_id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($section_id)) {
				$tmp_section_id[] = $section_id;
			}	
		}
		$sql->close();

		if(sizeof($tmp_section_id) > 0) {
			foreach($tmp_section_id as $section_id) {
				$sql = $con->prepare("SELECT eid,ename,`order` FROM example WHERE section_id=?");
				$sql->bind_param("i", $section_id);
				$sql->bind_result($eid, $ename, $order);
				$sql->execute();
				while($sql->fetch()) {
					if(isset($eid) && isset($ename) && isset($order)) {
						$tmp = new Example();
						$tmp->populate($eid, $section_id, $ename, $order);
						$examples[] = $tmp->expose();
					}
				}
				$sql->close();
			}
		}
	}

	else if(isset($args["eid"])) {
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
Returns the contents of the file associated to the example

Parameters:
	eid: 
		Gives the contents of the unique example

Note:
If there is no such example found, an appropriate response is returned.

*/
function get_example_file($con, $args) {
	if(isset($args["eid"])) {
		$eid = $args["eid"];
		$sql = $con->prepare("SELECT section_id,ename FROM example WHERE eid=?");
		$sql->bind_param("i", $eid);
		$sql->bind_result($section_id, $ename);
		$sql->execute();
		$sql->fetch();
		$sql->close();

		if(isset($section_id) && isset($ename)) {
			$sql = $con->prepare("SELECT tid,section_name FROM section WHERE section_id=?");
			$sql->bind_param("i", $section_id);
			$sql->bind_result($tid, $section_name);
			$sql->execute();
			$sql->fetch();
			$sql->close();

			if(isset($tid) && isset($section_name)) {
				$sql = $con->prepare("SELECT sid,tname FROM topic WHERE tid=?");
				$sql->bind_param("i", $tid);
				$sql->bind_result($sid, $tname);
				$sql->execute();
				$sql->fetch();
				$sql->close();

				if(isset($sid) && isset($tname)) {
					$sql = $con->prepare("SELECT sname FROM subject WHERE sid=?");
					$sql->bind_param("i", $sid);
					$sql->bind_result($sname);
					$sql->execute();
					$sql->fetch();
					$sql->close();

					if(isset($sname)) {
						$file = $_SERVER["DOCUMENT_ROOT"] . "/content/" . $sname . "/" . $tname . "/" . $section_name . "/" . $ename . ".html";
						if(file_exists($file)) {
							return file_get_contents($file);
						}
						else {
							return "The example seems to exists, but there is no file for it";
						}
					}
					else {
						return "There is no associated subject to this sid";
					}
				}
				else {
					return "There is no associated topic to this tid";
				}
			}
			else {
				return "There is no associated section to this section_id";
			}
		}
		else {
			return "There is no associated example to this eid";
		}
	}
	else {
		return "There was no eid passed in as a parameter";
	}
}

?>