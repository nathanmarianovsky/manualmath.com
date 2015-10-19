<?php

require_once $_SERVER["DOCUMENT_ROOT"] . "/classes/section.php";

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
	$tmp_tid = array();

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
				$sql = $con->prepare("SELECT section_id,section_name,`order` FROM section WHERE tid=?");
				$sql->bind_param("i", $tid);
				$sql->bind_result($section_id, $section_name, $order);
				$sql->execute();
				while($sql->fetch()) {
					if(isset($section_id) && isset($section_name) && isset($order)) {
						$tmp = new Section();
						$tmp->populate($section_id, $tid, $section_name, [], $order);
						$sections[] = $tmp->expose();
					}
				}
				$sql->close();
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
					$sql = $con->prepare("SELECT section_id,section_name,`order` FROM section WHERE tid=?");
					$sql->bind_param("i", $tid);
					$sql->bind_result($section_id, $section_name, $order);
					$sql->execute();
					while($sql->fetch()) {
						if(isset($section_id) && isset($section_name) && isset($order)) {
							$tmp = new Section();
							$tmp->populate($section_id, $tid, $section_name, [], $order);
							$sections[] = $tmp->expose();
						}
					}
					$sql->close();
				}
			}
		}
	}

	else if(isset($args["tid"])) {
		$tid = $args["tid"];
		$sql = $con->prepare("SELECT section_id,section_name,`order` FROM section WHERE tid=? ORDER BY `order` ASC");
		$sql->bind_param("i", $tid);
		$sql->bind_result($section_id, $section_name, $order);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($section_id) && isset($section_name) && isset($order)) {
				$tmp = new Section();
				$tmp->populate($section_id, $tid, $section_name, [], $order);
				$sections[] = $tmp->expose();
			}
		}
		$sql->close();
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
				$sql = $con->prepare("SELECT section_id,section_name,`order` FROM section WHERE tid=?");
				$sql->bind_param("i", $tid);
				$sql->bind_result($section_id, $section_name, $order);
				$sql->execute();
				while($sql->fetch()) {
					if(isset($section_id) && isset($section_name) && isset($order)) {
						$tmp = new Section();
						$tmp->populate($section_id, $tid, $section_name, [], $order);
						$sections[] = $tmp->expose();
					}
				}
				$sql->close();
			}
		}
	}

	else if(isset($args["section_id"])) {
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
Returns the contents of the file associated to the section

Parameters:
	section_id: 
		Gives the contents of the unique section

Note:
If there is no such section found, an appropriate response is returned.

*/
function get_section_file($con, $args) {
	if(isset($args["section_id"])) {
		$section_id = $args["section_id"];
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
					$file = $_SERVER["DOCUMENT_ROOT"] . "/content/" . $sname . "/" . $tname . "/" . $section_name . "/" . $section_name . ".html";
					if(file_exists($file)) {
						return file_get_contents($file);
					}
					else {
						return "The section seems to exists, but there is no file for it";
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
		return "There was no eid passed in as a parameter";
	}
}

?>