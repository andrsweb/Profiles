<?php

$is_admin = '';

if( $admin_value = $_COOKIE['admin'] ?? null ){
	$security_value = file_get_contents( 'security.txt' );

	if( $admin_value === $security_value ) $is_admin = ' class="user-admin"';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
	<link rel="manifest" href="favicon/site.webmanifest">
	<link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#5bbad5">
	<link rel="shortcut icon" href="favicon/favicon.ico">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="msapplication-config" content="favicon/browserconfig.xml">
	<meta name="theme-color" content="#ffffff">	
	
	<title>Частные мастера</title>
	<link rel="stylesheet" href="css/main.min.css" />
</head>
<body<?php echo $is_admin ?>>
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
					<div class="header-ui">
						<a class="header-tel" href="tel:+7999999999">
							<span class="time">
								Подобрать мастера. Круглосуточно
							</span>
							+7 (999) 999-99-99
						</a>

						<?php
						if( ! $is_admin ){
							?>
							<button class="popup-button">
								Добавить анкету
							</button>
							<?php
						}
						?>
					</div>
				</div>
			</div>
		</header>