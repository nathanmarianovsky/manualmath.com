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
Returns the content associated to a section

Parameters:
	section_id: 
		Gives the contents of the unique section

*/
function get_section_data($con, $args) {
	if(isset($args["section_id"])) {
		$section_id = $args["section_id"];
		$statement = "SELECT title,content FROM section WHERE section_id=?";
		$sql = $con->prepare($statement);
		$sql->bind_param("i", $section_id);
		$sql->bind_result($title, $content);
		$sql->execute();
		$sql->fetch();
		$sql->close();

		$title_arr = explode("-----", $title);
		$content_arr = explode("-----", $content);
		$obj = (array) [];
		for($k = 0; $k < sizeof($title_arr); $k++) {
			$obj["title" . $k] = $title_arr[$k];
			$obj["content" . $k] = $content_arr[$k];
		}
		return $obj;
	}
	else { return "There was no section_id passed in as a parameter!"; }
}

/*

Purpose:
Deletes a section in the database. Return 1 for success and 0 for failure.

Parameters:
	sid: 
		Deletes the unique section and all of its associated attributes

*/
function delete_section($con, $args) {
	if(isset($args["section_id"])) {
		$section_id = $args["section_id"];
		$sql = $con->prepare("SELECT section_id FROM section");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $section_id) {
					$sql->close();
					$sql = $con->prepare("DELETE FROM section WHERE section_id=?");
					$sql->bind_param("i", $section_id);
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
	else { return "There was no section_id passed in as a parameter!"; }
}

/*

Purpose:
Adds a section to the database. Return 1 for success and 0 for failure.

Parameters:
	sid: 
		Adds the unique section and all of its associated attributes

*/
function add_section($con, $args) {
	if(isset($args["section_id"]) && isset($args["section_name"]) && isset($args["order"]) && isset($args["tid"]) && isset($args["title"]) && isset($args["content"])) {
		$section_id = $args["section_id"];
		$section_name = $args["section_name"];
		$order = $args["order"];
		$tid = $args["tid"];
		$title = $args["title"];
		$content = $args["content"];
		$sql = $con->prepare("SELECT section_id FROM section");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $section_id) {
					$sql->close();
					return "0";
				}
			}
		}
		$sql = $con->prepare("SELECT tid FROM topic");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $tid) {
					$sql->close();
					$sql = $con->prepare("INSERT INTO section (section_id,section_name,`order`,tid,title,content) VALUES (?,?,?,?,?,?)");
					$sql->bind_param("isiiss", $section_id, $section_name, $order, $tid, $title, $content);
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

/*

Purpose:
Changes a section in the database. Return 1 for success and 0 for failure.

Parameters:
	sid: 
		Changes the unique section and all of its associated attributes

*/
function change_section($con, $args) {
	if(isset($args["section_id"])) {
		$section_id = $args["section_id"];
		$statement = "UPDATE section SET ";
		$sql = $con->prepare("SELECT section_id FROM section");
		$sql->bind_result($id);
		$sql->execute();
		while($sql->fetch()) {
			if(isset($id)) {
				if($id == $section_id) {
					$sql->close();
					if(isset($args["section_name"]) && $args["section_name"] != "undefined") {
						$statement .= "section_name='" . $args["section_name"] . "'";
					}
					if(isset($args["order"]) && $args["order"] != "undefined" && is_numeric($args["order"])) {
						if($statement[strlen($statement)-1] != " ") { $statement .= ","; }
						$statement .= "`order`='" . $args["order"] . "'";
					}
					if(isset($args["tid"]) && $args["tid"] != "undefined" && is_numeric($args["tid"])) {
						if($statement[strlen($statement)-1] != " ") { $statement .= ","; }
						$statement .= "tid='" . $args["tid"] . "'";
					}
					if(isset($args["title"]) && $args["title"] != "undefined") {
						if($statement[strlen($statement)-1] != " ") { $statement .= ","; }
						$statement .= "title='" . $args["title"] . "'";
					}
					if(isset($args["content"]) && $args["content"] != "undefined") {
						if($statement[strlen($statement)-1] != " ") { $statement .= ","; }
						$statement .= "content='" . $args["content"] . "'";
					}
					$statement .= " WHERE section_id=" . $section_id;
					$sql = $con->prepare($statement);
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
	else { return "You have provided an invalid section_id!"; }
}

?>