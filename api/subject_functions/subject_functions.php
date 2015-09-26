<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/classes/subject.php";

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

	if(isset($args['sid'])) {
		$sid = $args['sid'];
		$sql = $con->prepare("SELECT sname,`order` FROM Subject WHERE sid=?");
		$sql->bind_param('i', $sid);
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

	else if(isset($args['sname'])) {
		$sname = $args['sname'];
		$sql = $con->prepare("SELECT sid,`order` FROM Subject WHERE sname=?");
		$sql->bind_param('s', $sname);
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
		$sql = $con->prepare("SELECT sid,sname,`order` FROM Subject ORDER BY `order` ASC");
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

?>