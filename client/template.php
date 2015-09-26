<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF-8'>
		<meta name='author' content='Nathan Marianovsky'>
		<title></title>
		<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/css/materialize.min.css'>
		<link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'>
		<style type="text/css">
			<?php 
				require_once $_SERVER['DOCUMENT_ROOT'] . '/styles/styles.css';
				require_once $_SERVER['DOCUMENT_ROOT'] . '/styles/sidebar.css';
				require_once $_SERVER['DOCUMENT_ROOT'] . '/styles/latex.css';
			?>
		</style>
		<script data-main='/scripts/config' type='text/javascript' src='/node_modules/requirejs/require.js'></script>
	</head>
	<body>
		<header>
			<?php 
				include 'topbar.php';
				include 'sidebar.php';
			?>
		</header>
		<main></main>
	</body>
</html>