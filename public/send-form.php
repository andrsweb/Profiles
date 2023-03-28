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

$name		 = isset( $_POST['name'] ) ? as_clean_value( $_POST['name'] ) : null;
$age		 = isset( $_POST['age'] ) ? as_clean_value( $_POST['age'] ) : null;
$email		 = isset( $_POST['email'] ) ? as_clean_value( $_POST['email'] ) : null;
$tel		 = isset( $_POST['tel'] ) ? as_clean_value( $_POST['tel'] ) : null;


$message = "Привет!\n" .
		"Форма заказа онлайн консультации:\n\n" .
		"Имя - $name\n" .
		"Телефон - $tel\n\n\n";

// Sending mail.
if( mail('andrsweb@mail.ru', 'Message', $message ) )
	echo 'Спасибо за Ваше сообщение! Ваша заявка будет рассмотрена в ближайшее время';	// Success.
else
	echo 'Ошибка отправки! Попробуйте позже!';	// Failed.

die();
