<?php

$user = $_GET['user'];
$pass = $_GET['pass'];

if( $user === 'admin' && $pass === 'admin' ){
	$security_value = time() . rand( 0, 999999 ) . rand( 0, 999999 );

	if( isset( $_COOKIE['admin'] ) ) setcookie( 'admin', '', time() - 3600, '/' );

	setcookie( 'admin', $security_value, time() + 3600, '/' );    // Set cookie for 1 hour.
	file_put_contents( 'security.txt', $security_value );

	$is_admin = ' user-admin';
}	else {
	$is_admin = '';
}
?>

<html>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width,initial-scale=1">

	<link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
	<link rel="manifest" href="favicon/site.webmanifest">
	<link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#5bbad5">
	<link rel="shortcut icon" href="favicon/favicon.ico">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="msapplication-config" content="favicon/browserconfig.xml">
	<meta name="theme-color" content="#ffffff">

	<title>Добавить карточку</title>
	<link rel="stylesheet" href="css/main.min.css">
</head>
<body class="admin-page<?php echo $is_admin ?>">
<div class="wrapper">
	<header class="header">
		<div class="container">
			<div class="header-wrapper">
				<a href="/" class="header-logo-wrapper">
					<div class="header-logo">
						М
					</div>
					<p class="header-logo-text">
						Частные <br> мастера
					</p>
				</a>
				<div class="admin-text">
					<?php
					if( $is_admin ) echo 'Здесь вы можете добавить анкету мастера';
					else echo 'У Вас нет прав для просмотра данной страницы';
					?>
				</div>
			</div>
		</div>
	</header>

