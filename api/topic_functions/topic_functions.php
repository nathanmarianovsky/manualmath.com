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

	if(isset($args["tid"])) {
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
Returns the content associated to the topic

Parameters:
	tid: 
		Gives the contents of the unique topic

*/
function get_topic_data($con, $args) {
	if(isset($args["tid"])) {
		$tid = $args["tid"];
		$sql = $con->prepare("SELECT about FROM topic WHERE tid=?");
		$sql->bind_param("i", $tid);
		$sql->bind_result($about);
		$sql->execute();
		$sql->fetch();
		$sql->close();
		return $about;
	}
	else { return "There was no tid passed in as a parameter!"; }
}

/*

Purpose:
Deletes a topic in the database. Return 1 for success and 0 for failure.

Parameters:
	sid: 
		Deletes the unique topic and all of its associated attributes

*/
function delete_topic($con, $args) {
	if(isset($args["tid"])) {
		$tid = $args["tid"];
		$sql = $con->prepare("SELECT tid FROM topic");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $tid) {
					$sql->close();
					$sql = $con->prepare("DELETE FROM topic WHERE tid=?");
					$sql->bind_param("i", $tid);
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
	else { return "There was no tid passed in as a parameter!"; }
}

/*

Purpose:
Adds a topic to the database. Return 1 for success and 0 for failure.

Parameters:
	sid: 
		Adds the unique topic and all of its associated attributes

*/
function add_topic($con, $args) {
	if(isset($args["tid"]) && isset($args["tname"]) && isset($args["order"]) && isset($args["sid"]) && isset($args["about"])) {
		$tid = $args["tid"];
		$tname = $args["tname"];
		$order = $args["order"];
		$sid = $args["sid"];
		$about = $args["about"];
		$sql = $con->prepare("SELECT tid FROM topic");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $tid) {
					$sql->close();
					return "0";
				}
			}
		}
		$sql = $con->prepare("SELECT sid FROM subject");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $sid) {
					$sql->close();
					$sql = $con->prepare("INSERT INTO topic (tid,tname,`order`,sid,about) VALUES (?,?,?,?,?)");
					$sql->bind_param("isiis", $tid, $tname, $order, $sid, $about);
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