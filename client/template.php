<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF-8'>
		<meta name='author' content='Nathan Marianovsky'>
		<title></title>
		<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/css/materialize.min.css'>
		<link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'>
		<link rel='stylesheet' type='text/css' href='/styles/styles.css'>
		<script data-main='/scripts/config' type='text/javascript' src='/node_modules/requirejs/require.js'></script>
	</head>
	<body>
		<header>
			<div class='navbar-fixed'>
				<nav class='top-nav'>
				    <div class='nav-wrapper'>
					    <a href='#' id='hamburger_button' data-activates='nav-mobile' class='button-collapse'>
					      	<i class='mdi-navigation-menu'></i>
					    </a>
				    	<div id='header_div'>
				    		<a href='home.php' id='logo'>man math</a>
			    			<a id='page_title'></a>
				    	</div>
				    </div>
				</nav>
			</div>
			<ul id='nav-mobile' class='side-nav fixed'></ul>
		</header>
		<main></main>
	</body>
</html>