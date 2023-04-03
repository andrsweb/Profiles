
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
<body class="admin-page">
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
						Здесь вы можете добавить анкету мастера
					</div>
				</div>
			</div>
		</header>

<main>
	<section class="hero">
	<div class="container">
		<h1 class="admin-title">
			Чтобы добавить анкету, заполните данные ниже
		</h1>
<?php
	$user = $_GET['user'];
	$pass = $_GET['pass'];

	if( $user === "admin" && $pass === "admin" ) {
		'
		<form class="cards-form" data-type="admin-form">
			<fieldset>
				<div class="left">
					<div class="hero-input">
						<label for="full-name">
							ФИО
						</label>
						<input id="full-name" type="text" name="full-name">
					</div>
					<div class="hero-input">
						<label for="town">
							Город
						</label>
						<input id="town" type="text" name="town">
					</div>
						<div class="hero-input">
						<label for="district">
							Район
						</label>
						<input id="district" name="dist" type="text">
					</div>
					<div class="hero-input">
						<label for="address">
							Адрес
						</label>
						<input id="address" name="address" type="text">
					</div>
					<div class="hero-input">
						<label for="met">
							Метро
						</label>
						<input id="met" name="metro" type="text">
					</div>
					<div class="hero-input">
						<label for="service">
							Услуги
						</label>
						<input id="service" name="tech" type="text">
					</div>
					<div class="hero-input">
						<label for="what">
							Что умею
						</label>
						<input id="what" name="skill" type="text">
					</div>
					<div class="hero-input">
						<label for="done">
							Выполнено работ
						</label>
						<input id="done" name="done" type="text">
					</div>
						<div class="hero-input">
						<label for="exp">
							Опыт
						</label>
						<input id="exp" name="exp" type="text">
					</div>
				</div>
				<div class="right">		
					<div class="hero-input">
						<label for="arr">
							Выезд
						</label>
						<input id="arr" name="arrive" type="text">
					</div>
					<div class="hero-input">
						<label for="days">
							Дни работы
						</label>
						<input id="days" name="days" type="text">
					</div>
						<div class="hero-input">
						<label for="about-me">
							Обо мне
						</label>
						<input id="about-me" name="about" type="text">
					</div>
						<div class="hero-input">
						<label for="garanty">
							Гарантия
						</label>
						<input id="garanty" name="gar" type="text">
					</div>
					<div class="hero-input">
						<label for="work-time">
							Время работы
						</label>
						<input id="work-time" name="workTime" type="text">
					</div>
					<div class="hero-input">
						<label for="src">
							Изображение
						</label>
						<input id="work-time" name="src" type="text" placeholder="img/cards/...">
					</div>
					<div class="hero-input">
						<label for="rate">
							Рейтинг
						</label>
						<input id="rate" name="rate" type="text" placeholder="1-5">
					</div>
					<div class="hero-input">
						<label for="tel">
							Телефон
						</label>
						<input id="tel" name="tel" type="text" placeholder="+7(***)***-**-**">
					</div>
				</div>
			</fieldset>
			<button class="send-form">
				Отправить
			</button>
			<div class="form-response"></div>
		</form>
	';
	}
	else {
		echo "отсоси хуйца";
	} 
?>

	</div>
</section>
</main>
<footer class="footer">
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
			<div class="row row-info">
				<div class="col">
					г.Москва
				</div>
				<div class="col">
					Компания "Частные мастера"
				</div>
			</div>
			</div>
		</div>
	</footer></div>
		
	<!-- .wrapper -->
	<script src="js/main.min.js"></script>
</body>
</html>

