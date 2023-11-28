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

/**
 * Function checks phone symbols.
 *
 * @param   string  $phone  Some phone number.
 * @return  bool            True if OK, false if string has bad symbols.
 */
function as_check_phone( string $phone ): bool
{
	return preg_match('/^[0-9()+\-\s]+$/iu', $phone );
}

function as_working_hours( string $hours ): bool
{
	return preg_match('/^[0-9.:\-\s]+$/iu', $hours );
}

if( ! empty( $_POST ) && isset( $_POST['func'] ) ){
	switch( $_POST['func'] ){
		case 'send-card':
		case 'admin-form':
			get_data();
			break;

		case 'card-form':
			as_send_card_form();
			break;

			case 'rate-form':
				as_send_rate_form();
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
	$is_admin	= as_clean_value( $_POST['admin'] );
	$card_id	= as_clean_value( $_POST['card'] );
	$name		= as_clean_value( $_POST['full-name'] );
	$town		= as_clean_value( $_POST['town'] );
	$metro		= as_clean_value( $_POST['metro'] );
	$tech		= as_clean_value( $_POST['tech'] );
	$dist		= as_clean_value( $_POST['dist'] );
	$address	= as_clean_value( $_POST['address'] );
	$skill	    = as_clean_value( $_POST['skill'] );
	$about	    = as_clean_value( $_POST['about'] );
	$rate	    = as_clean_value( $_POST['rate'] );
	$done	    = as_clean_value( $_POST['done'] );
	$tel	    = as_clean_value( $_POST['tel'] );
	$exp	    = as_clean_value( $_POST['exp'] );
	$arr	    = as_clean_value( $_POST['arrive'] );
	$days	    = as_clean_value( $_POST['days'] );
	$gar	    = as_clean_value( $_POST['gar'] );
	$workTime	= as_clean_value( $_POST['workTime'] );
	$online		= as_clean_value( $_POST['online'] );
	$map		= as_clean_value( $_POST['map'] );
	$file_name	= 'data/data.json';

	if( $is_admin && ! is_admin() ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Ошибка - попытка публикации от имени Администратора.'
		] );
		die();
	}

	if(
		! $name || ! $town || ! $metro || ! $tech || ! $dist || ! $address || ! $skill
		|| ! $about || ! $tel || ! $exp || ! $arr || ! $days || ! $gar
	){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Пожалуйста, заполните все необходимые поля.'
		] );
		die();
	}

	// If form was sent from the Admin page - check more fields.
	if( $is_admin || $card_id ){
		if( ! $rate || ! $done ){
			echo json_encode( [
				'success'	=> 0,
				'message'	=> 'Пожалуйста, заполните все необходимые поля.'
			] );
			die();
		}
	}

	// Phone is not valid.
	if( ! as_check_phone( $tel ) ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Пожалуйста, введите корректный телефон.'
		] );
		die();
	}

	if( ! as_working_hours( $workTime ) ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Пожалуйста, введите корректный график работы.'
		] );
		die();
	}

	// Check rating value.
	if( $rate ){
		if( ! is_numeric( $rate ) || $rate < 0 || $rate > 5 ){
			echo json_encode( [
				'success'	=> 0,
				'message'	=> 'Пожалуйста, введите корректный рейтинг (0-5, можно дробный).'
			] );
			die();
		}	else {
			$rate = number_format( $rate, 1 );
		}
	}

	// Check done value.
	if( $done ){
		if( ! is_numeric( $done ) || $done < 0 ){
			echo json_encode( [
				'success'	=> 0,
				'message'	=> 'Пожалуйста, введите корректное количество работ.'
			] );
			die();
		}	else {
			$done = ( int ) $done;
		}
	}

	// If avatar uploaded.
	if( isset( $_FILES['src']['size'] ) && $_FILES['src']['size'] > 0 ){
		// Conditions for avatar: ( png | jpg | jpeg ) and < 1 MB.
		$allowed_image_types	= ['image/jpeg', 'image/png'];
		$max_image_size			= 1000000;
		$src_name				= $_FILES['src']['name'];
		$image_path				= "img/cards/{$src_name}";
		$src_temp				= $_FILES['src']['tmp_name'];

		// Check conditions for avatar.
		if( ! in_array( $_FILES['src']['type'], $allowed_image_types ) || ( int ) $_FILES['src']['size'] > $max_image_size ){
			echo json_encode( [
				'success'	=> 0,
				'message'	=> 'Пожалуйста, загружайте картинку до 1Мб формата JPG | JPEG | PNG.'
			] );
			die();
		}

		// If avatar uploaded successfully.
		if( is_uploaded_file( $src_temp ) ){
			// If not saved.
			if( ! move_uploaded_file( $src_temp, $image_path ) ){
				echo json_encode( [
					'success'	=> 0,
					'message'	=> 'Ошибка - изображение не сохранено.'
				] );
				die();
			}
		}	else {	// Upload error.
			echo json_encode( [
				'success'	=> 0,
				'message'	=> 'Ошибка загрузки изображения.'
			] );
			die();
		}
	}

	$new_card = [
		'id'		=> time() . '.' . rand( 0, 99999 ) . '.' . rand( 0, 99999 ),
		'name'		=> $name,
		'town'		=> $town,
		'metro'		=> $metro,
		'tech'		=> $tech,
		'dist'		=> $dist,
		'src'		=> $image_path ?? '',
		'address'	=> $address,
		'skill'		=> $skill,
		'about'		=> $about,
		'rate'		=> $rate ?: '0',
		'done'		=> $done ?: '0',
		'tel'		=> $tel,
		'exp'		=> $exp,
		'arrive'	=> $arr,
		'days'		=> $days,
		'gar'		=> $gar,
		'workTime'	=> $workTime,
		'online'	=> $online,
		'map'		=> $map,
		'approved'	=> ( $is_admin && is_admin() ) ? '1' : '0'
	];

	// If this is card editing.
	if( $card_id ){
		if( ! is_admin() ){
			echo json_encode( [
				'success'	=> 0,
				'message'	=> 'Ошибка - попытка редактирования от имени Администратора.'
			] );
			die();
		}

		if( ! file_exists( $file_name ) ){
			echo json_encode( [
				'success'	=> 0,
				'message'	=> 'Ошибка - данные отсутствуют.'
			] );
			die();
		}

		$current_data	= file_get_contents( $file_name );
		$array_data		= json_decode( $current_data, true );
		$updated_data	= [];

		foreach( $array_data as $item ){
			// Card found.
			if( $item['id'] === $card_id ){
				$new_card['src']		= $image_path ?? $item['src'];
				$new_card['approved']	= $item['approved'];
				$updated_data[]			= $new_card;
			}	else {
				$updated_data[] = $item;
			}
		}

		$array_data = $updated_data;
	}	else{
		if( file_exists( $file_name ) ){
			$current_data	= file_get_contents( $file_name );
			$array_data		= json_decode( $current_data, true );
			$array_data[]	= $new_card;
		}	else{
			$array_data = [ $new_card ];
		}
	}

	if( file_put_contents( $file_name, json_encode( $array_data, JSON_UNESCAPED_UNICODE ) ) )
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

	$card_id	= as_clean_value( $_POST['id'] );
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

	$card_id	= as_clean_value( $_POST['id'] );
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
		if( $item['id'] !== $card_id ){
			$result[] = $item;
		}	else {
			$avatar = $item['src'];

			// Delete avatar of deleted card.
			if( $avatar && file_exists( $avatar ) ) unlink( $avatar );
		}
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

function as_send_rate_form(){
	$name	= isset( $_POST['name'] ) ? as_clean_value( $_POST['name'] ) : null;
	$email	= isset( $_POST['email'] ) ? as_clean_value( $_POST['email'] ) : null;
	$tel	= isset( $_POST['tel'] ) ? as_clean_value( $_POST['tel'] ) : null;
	$text	= isset( $_POST['text'] ) ? as_clean_value( $_POST['tel'] ) : null;

	// Prepare message for mail.
	$message = "Привет!\n" .
		"Отзыв о мастере:\n\n" .
		"ФИО - $name\n" .
		"Почта - $email\n" .
		"Телефон - $tel\n" .
		"Отзыв - $text\n\n\n";

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

/**
 * Shows formatted structure of any values for testing.
 *
 * @param $smth
 * @return void
 */
function print_smth( $smth ){
	echo '<pre>' . print_r( $smth, 1 ) . '</pre>';
}

die();