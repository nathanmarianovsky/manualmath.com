<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF-8'>
		<meta name='author' content='Nathan Marianovsky'>
		<title></title>
		<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/css/materialize.min.css'>
		<link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'>
		<link rel='stylesheet' type='text/css' href='/styles/styles.css'>
		<link rel='stylesheet' type='text/css' href='/styles/sidebar.css'>
		<link rel='stylesheet' type='text/css' href='/styles/latex.css'>
		<script data-main='/scripts/config' type='text/javascript' src='/node_modules/requirejs/require.js'></script>
	</head>
	<body>
		<header>
			<div class='navbar-fixed'>
				<nav class='top-nav'>
				    <div class='nav-wrapper'>
				    	<a href='home.php' id='brand-logo' class='brand-logo tooltipped' data-position='right' data-delay='50' data-tooltip='Click on me to go home!'>man math</a>
				    	<ul class='hide-on-med-and-down' id='page_title_ul'>
			    			<a href='#' id='page_title'></a>	
				    	</ul>
				    </div>
				    <a href="#" data-activates='nav-mobile' class='button-collapse top-nav full hide-on-large-only left'>
				      <i class='mdi-navigation-menu'></i>
				    </a>
				</nav>
			</div>
			<ul id='nav-mobile' class='side-nav fixed' style='width:350px;'></ul>
		</header>
		<main></main>
	</body>
</html>