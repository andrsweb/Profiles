<?php

/**
 * Clean incoming value from trash.
 *
 * @param	mixed	$value	Some value to clean.
 * @return	mixed	$value	The same value, but cleaned.
 */
function as_clean_value( $value )
{
	$value = trim( $value );
	$value = stripslashes( $value );
	$value = strip_tags( $value );

	return htmlspecialchars( $value );
}

if( ! empty( $_POST ) && isset( $_POST['func'] ) ){
	switch( $_POST['func'] ){
		case 'header-form':
			as_send_header_form();
			break;

		case 'card-form':
			as_send_card_form();
			break;

		default:
			as_send_header_form();
	}
}

function as_send_header_form(){
	$name		 = isset( $_POST['name'] ) ? as_clean_value( $_POST['name'] ) : null;
	$age		 = isset( $_POST['age'] ) ? as_clean_value( $_POST['age'] ) : null;
	$email		 = isset( $_POST['email'] ) ? as_clean_value( $_POST['email'] ) : null;
	$tel		 = isset( $_POST['tel'] ) ? as_clean_value( $_POST['tel'] ) : null;
	$text		 = isset( $_POST['text'] ) ? as_clean_value( $_POST['text'] ) : null;

	// Prepare message for mail.
	$message = "Заявка\n" .
		"Анкета:\n\n" .
		"ФИО - $name\n" .
		"Возраст - $age\n" .
		"Почта - $email\n" .
		"Телефон - $tel\n" .
		"О себе - $text\n\n\n";

	as_send_email( 'Анкета', $message );
}

function as_send_card_form(){
	$name		 = isset( $_POST['name'] ) ? as_clean_value( $_POST['name'] ) : null;
	$email		 = isset( $_POST['email'] ) ? as_clean_value( $_POST['email'] ) : null;
	$tel		 = isset( $_POST['tel'] ) ? as_clean_value( $_POST['tel'] ) : null;

	// Prepare message for mail.
	$message = "Привет!\n" .
		"Заявка:\n\n" .
		"ФИО - $name\n" .
		"Почта - $email\n" .
		"Телефон - $tel\n\n\n";

	as_send_email( 'Заявка', $message );
}


function as_send_email( string $subject, string $message ){

	$result = mail('golden-web@mail.ru', $subject, $message );

	if( $result )
		echo json_encode( [
			'success'	=> 1,
			'message'	=> 'Спасибо за Ваше сообщение! Мы свяжемся с Вами в ближайшее время.'
		] );	// Success.
	else
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Ошибка отправки. Пожалуйста, попробуйте позже.'
		] );	// Failed.
}

die();
