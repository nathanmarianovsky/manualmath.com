<?php

require_once $_SERVER["DOCUMENT_ROOT"] . "/api/classes/topic.php";

/*

Purpose:
Returns an array of all the topic(s) associated to a given parameter without all of
the relevant examples and sections

Parameters:
	sid: 
		Gives all topics under the subject
	sname: 
		Gives all topics under the subject
	tid: 
		Gives a unique single topic
	tname: 
		Gives all topics with this name
	no parameter: 
		Gives all sections in the database

Note:
If there are no topics found, then an empty array is returned.

*/
function get_topics($con, $args) {
	$topics = array();

	if(isset($args["sid"])) {
		$sid = $args["sid"];
		$sql = $con->prepare("SELECT tid,tname,`order` FROM topic WHERE sid=? ORDER BY `order` ASC");
		$sql->bind_param("i", $sid);
		$sql->bind_result($tid, $tname, $order);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($tid) && isset($tname) && isset($order)) {
				$tmp = new Topic();
				$tmp->populate($sid, $tid, $tname, [], $order);
				$topic = $tmp->expose();
				$topics[] = $topic;
			}
		}
		$sql->close();
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
			$sql = $con->prepare("SELECT tid,tname,`order` FROM topic WHERE sid=? ORDER BY `order` ASC");
			$sql->bind_param("i", $sid);
			$sql->bind_result($tid, $tname, $order);
			$sql->execute();
			while($sql->fetch()) {
				if(isset($tid) && isset($tname) && isset($order)) {
					$tmp = new Topic();
					$tmp->populate($sid, $tid, $tname, [], $order);
					$topics[] = $tmp->expose();
				}
			}
			$sql->close();
		}
	}

	else if(isset($args["tid"])) {
		$tid = $args["tid"];
		$sql = $con->prepare("SELECT sid,tname,`order` FROM topic WHERE tid=?");
		$sql->bind_param("i", $tid);
		$sql->bind_result($sid, $tname, $order);
		$sql->execute();
		$sql->fetch();
		$sql->close();

		if(isset($sid) && isset($tname) && isset($order)) {
			$tmp = new Topic();
			$tmp->populate($sid, $tid, $tname, [], $order);
			$topics[] = $tmp->expose();
		}
	}

	else if(isset($args["tname"])) {
		$tname = $args["tname"];
		$sql = $con->prepare("SELECT sid,tid,`order` FROM topic WHERE tname=?");
		$sql->bind_param("s", $tname);
		$sql->bind_result($sid, $tid, $order);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($sid) && isset($tid) && isset($order)) {
				$tmp = new Topic();
				$tmp->populate($sid, $tid, $tname, [], $order);
				$topics[] = $tmp->expose();
			}
		}
		$sql->close();
	}

	else {
		$sql = $con->prepare("SELECT sid,tid,tname,`order` FROM topic");
		$sql->bind_result($sid, $tid, $tname, $order);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($sid) && isset($tid) && isset($tname) && isset($order)) {
				$tmp = new Topic();
				$tmp->populate($sid, $tid, $tname, [], $order);
				$topic = $tmp->expose();
				$topics[] = $topic;
			}
		}
		$sql->close();
	}

	return $topics;
}

/*

Purpose:
Returns the contents of the file associated to the topic

Parameters:
	tid: 
		Gives the contents of the unique topic

Note:
If there is no such topic found, an appropriate response is returned.

*/
function get_topic_file($con, $args) {
	if(isset($args["tid"])) {
		$tid = $args["tid"];
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
				$file = $_SERVER["DOCUMENT_ROOT"] . "/content/" . $sname . "/" . $tname . "/" . $tname . ".html";
				if(file_exists($file)) {
					return file_get_contents($file);
				}
				else {
					return "The topic seems to exists, but there is no file for it";
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
		return "There was no tid passed in as a parameter";
	}
}

?>