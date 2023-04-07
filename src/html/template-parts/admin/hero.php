<section class="hero">
	<div class="container">
		<?php
		if( $is_admin ){
			?>
			<h1 class="admin-title">
				Чтобы добавить анкету, заполните данные ниже
			</h1>
			<form class="cards-form" enctype="multipart/form-data" data-type="admin-form" data-admin="1">
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
								Район <br>
								(населенный пункт)
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
						<div class="hero-input image-input">
							<label for="src">
								Изображение (макс. 1Мб)
							</label>
							<input id="src" name="src" type="file" />
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
			<?php
		}	else {
			?>
				<form class="enter-form" method="GET">
					<fieldset>
						<input name="user" type="text" placeholder="Логин">
						<input name="pass" type="text" placeholder="Пароль">
					</fieldset>
					<button>
						Войти
					</button>
				</form>
			<?
		}
		?>
	</div>
</section>

