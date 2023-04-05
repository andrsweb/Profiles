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
		case 'send-card':
			get_data();
			break;

		case 'card-form':
			as_send_card_form();
			break;

		case 'admin-form':
			get_data();
			break;

		case 'approve-card':
			approve_card();
			break;

		case 'delete-card':
			delete_card();
			break;

		default:
			as_send_header_form();
	}
}

function get_data(){
	$name		= $_POST['full-name'];
	$town		= $_POST['town'];
	$metro		= $_POST['metro'];
	$tech		= $_POST['tech'];
	$dist		= $_POST['dist'];
	$src		= $_POST['src'];
	$address	= $_POST['address'];
	$skill	    = $_POST['skill'];
	$about	    = $_POST['about'];
	$rate	    = $_POST['rate'];
	$done	    = $_POST['done'];
	$tel	    = $_POST['tel'];
	$exp	    = $_POST['exp'];
	$arr	    = $_POST['arrive'];
	$days	    = $_POST['days'];
	$gar	    = $_POST['gar'];
	$workTime	= $_POST['workTime'];
	$file_name	= 'data/data.json';

	// if(
	// 	! $name || ! $town || ! $metro || ! $tech || ! $dist || ! $address || ! $skill || ! $about
	// 	|| ! $rate || ! $done || ! $tel || ! $exp || ! $arr || ! $days || ! $gar || ! $workTime
	// ){
	// 	echo json_encode( [
	// 		'success'	=> 0,
	// 		'message'	=> 'Пожалуйста, заполните все необходимые поля.'
	// 	] );
	// 	die();
	// }

	if( file_exists( $file_name ) ){
		$current_data	= file_get_contents( $file_name );
		$array_data		= json_decode( $current_data, true );
		$extra			= [
			'id'		=> time() . '.' . rand( 0, 99999 ) . '.' . rand( 0, 99999 ),
			'name'		=> $name,
			'town'		=> $town,
			'metro'		=> $metro,
			'tech'		=> $tech,
			'dist'		=> $dist,
			'src'		=> $src,
			'address'	=> $address,
			'skill'		=> $skill,
			'about'		=> $about,
			'rate'		=> $rate,
			'done'		=> $done,
			'tel'		=> $tel,
			'exp'		=> $exp,
			'arrive'	=> $arr,
			'days'		=> $days,
			'gar'		=> $gar,
			'workTime'	=> $workTime,
			'approved'	=> is_admin() ? '1' : '0'
		];
		$array_data[]	= $extra;
		$data_to_write	= json_encode( $array_data, JSON_UNESCAPED_UNICODE );
	}	else {
		$datae = [[
			'id'		=> time() . '.' . rand( 0, 99999 ) . '.' . rand( 0, 99999 ),
			'name'		=> $name,
			'town'		=> $town,
			'metro'		=> $metro,
			'tech'		=> $tech,
			'dist'		=> $dist,
			'src'		=> $src,
			'address'	=> $address,
			'skill'		=> $skill,
			'about'		=> $about,
			'rate'		=> $rate,
			'done'		=> $done,
			'tel'		=> $tel,
			'exp'		=> $exp,
			'arrive'	=> $arr,
			'days'		=> $days,
			'gar'		=> $gar,
			'workTime'	=> $workTime,
			'approved'	=> is_admin() ? '1' : '0'
		]];
		$data_to_write = json_encode( $datae, JSON_UNESCAPED_UNICODE );
	}

	if( file_put_contents( $file_name, $data_to_write ) )
		echo json_encode( [
			'success'	=> 1,
			'message'	=> 'Анкета отправлена'
		] );	// Success.
	else
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Ошибка отправки. Пожалуйста, попробуйте позже.'
		] );	// Failed.
}

/**
 * Approve card as Admin.
 *
 * @return void
 */
function approve_card(){
	if( ! is_admin() ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Несанкционированный доступ. У Вас нет права совершать это действие.'
		] );
		die();
	}

	$card_id	= $_POST['id'];
	$file_name	= 'data/data.json';

	// No card ID, nothing to approve.
	if( ! $card_id ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'ID не получен.'
		] );
		die();
	}

	// File with data is missing.
	if( ! file_exists( $file_name ) ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Хранилище данных отсутствует.'
		] );
		die();
	}

	$current_data	= file_get_contents( $file_name );
	$array_data		= json_decode( $current_data, true );

	// Find data row with the same ID and set 'approved' = 1.
	foreach( $array_data as $key => $item ){
		if( $item['id'] === $card_id ){
			$array_data[$key]['approved'] = '1';
			break;
		}
	}

	$data_to_write = json_encode( $array_data, JSON_UNESCAPED_UNICODE );

	if( file_put_contents( $file_name, $data_to_write ) )
		echo json_encode( [
			'success'	=> 1,
			'message'	=> 'Анкета одобрена'
		] );	// Success.
	else
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Ошибка записи данных. Пожалуйста, попробуйте позже.'
		] );	// Failed.
}

/**
 * Delete card as Admin.
 *
 * @return void
 */
function delete_card(){
	if( ! is_admin() ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Несанкционированный доступ. У Вас нет права совершать это действие.'
		] );
		die();
	}

	$card_id	= $_POST['id'];
	$file_name	= 'data/data.json';

	// No card ID, nothing to approve.
	if( ! $card_id ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'ID не получен.'
		] );
		die();
	}

	// File with data is missing.
	if( ! file_exists( $file_name ) ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Хранилище данных отсутствует.'
		] );
		die();
	}

	$current_data	= file_get_contents( $file_name );
	$array_data		= json_decode( $current_data, true );
	$result			= [];

	foreach( $array_data as $item ){
		if( $item['id'] !== $card_id ) $result[] = $item;
	}

	$data_to_write = json_encode( $result, JSON_UNESCAPED_UNICODE );

	if( file_put_contents( $file_name, $data_to_write ) )
		echo json_encode( [
			'success'	=> 1,
			'message'	=> 'Анкета отклонена'
		] );	// Success.
	else
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Ошибка записи данных. Пожалуйста, попробуйте позже.'
		] );	// Failed.
}

/**
 * Check if this is Admin user.
 *
 * @return bool
 */
function is_admin(): bool
{
	// No admin cookie.
	if( ! $admin_value = $_COOKIE['admin'] ) return false;

	$security_value = file_get_contents( 'security.txt' );

	// Admin cookie not equal to security value in file.
	if( $admin_value !== $security_value ) return false;

	return true;
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
	$name	= isset( $_POST['name'] ) ? as_clean_value( $_POST['name'] ) : null;
	$email	= isset( $_POST['email'] ) ? as_clean_value( $_POST['email'] ) : null;
	$tel	= isset( $_POST['tel'] ) ? as_clean_value( $_POST['tel'] ) : null;

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

function print_smth( $smth ){
	echo '<pre>' . print_r( $smth, 1 ) . '</pre>';
}

die();