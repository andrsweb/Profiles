<?php

require_once 'template-parts/admin/header/header.php';
?>

<main>
	<?php require_once 'template-parts/admin/hero.php' ?>
</main>

<?php
if( $is_admin ) require_once 'template-parts/admin/cards.php';

require_once 'template-parts/admin/footer/footer.php';
?>

