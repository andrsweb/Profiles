let data = []

document.addEventListener('DOMContentLoaded', () => {
	'use strict'

	getAllData().then( json => {
		if( Array.isArray( json ) ){
			data = json.filter( card => card.approved === '0' )
			generateCards()
		}
	} )
} )

/**
 * Just get all data from json file.
 *
 * @returns {Promise<any>}
 */
const getAllData = async () => {
	let res

	try {
		res = await fetch('data/data.json')
	} catch (err) {
		console.error(`Error: ${err.message}`)
		return
	}

	return await res.json()
}

/**
 * Turn filtered data into HTML.
 */
const generateCards = () => {
	const results	= document.querySelector('#admin-cards-list')
	let structure	= ''

	if( ! results ) return

	data.forEach( card => structure += getCardStructure( card ) )
	results.innerHTML = structure
	approveCard()
	declineCard()
}

/**
 * Get HTML structure of the card.
 *
 * @param id
 * @param town
 * @param dist
 * @param metro
 * @param tech
 * @param name
 * @param src
 * @param skill
 * @param address
 * @param about
 * @param done
 * @param tel
 * @param rate
 * @param exp
 * @param gar
 * @param arrive
 * @param workTime
 * @param days
 * @returns {string}	HTML structure of the card.
 */
const getCardStructure = ( { id, town, dist, metro, tech, name, src, skill, address, about, done, tel, rate, exp, gar, arrive, workTime, days } ) => {
	return `<li class="card" data-id="${ id }">
	<div class="card-inner"> 
		<div class="card-left">
			<div class="card-img">
				<img class="card-avatar" src="${src}" width="240" height="240" alt="">
			</div>
			<div class="card-rate">
				Рейтинг
				<img src="img/cards/star.svg" width="30" height="30" alt="">
				<span>${rate}</span>
			</div>
			<div class="card-buttons">
				<a class="card-phone card-btn-style" href="tel:${tel}">
					<img src="img/cards/phone.svg" width="24" height="24" alt="">
					${tel}
				</a>
				<button class="button admin-approve-card">Одобрить</button>
				<button class="button admin-delete-card">Удалить</button>
			</div>
		</div>
		<div class="card-middle">
			<div class="card-name">
				${name}
				<span>был в сети ${online}</span>
			</div>
			<div class="card-verify">
				<div class="card-verify-item">
					<img src="img/cards/blue-check.svg" width="24" height="24" alt="">
					документы проверены
				</div>
				<div class="card-verify-item">
					<img src="img/cards/green-check.svg" width="24" height="24" alt="">
					данные подтверждены
				</div>
			</div>
			<div class="card-tech">
				${tech}
			</div>
			<div class="card-about">
				<div class="card-about-item">
					<div class="card-about-title">
						Оказано услуг
					</div>
					<div class="card-about-value">
						${done}
					</div>			
				</div>
				<div class="card-about-item">
					<div class="card-about-title">
						Опыт работы
					</div>
					<div class="card-about-value">
						${exp} 
					</div>			
				</div>
				<div class="card-about-item">
					<div class="card-about-title">
						Гарантия
					</div>
					<div class="card-about-value">
						${gar} 
					</div>			
				</div>
				<div class="card-about-item">
					<div class="card-about-title">
						Выезд на дом
					</div>
					<div class="card-about-value">
						${arrive} 
					</div>			
			</div>
			</div>
			<div class="card-graph">
				<div class="card-graph-item">
					<img src="img/cards/date.svg" width="24" height="24" alt="">
					${days}, ${workTime}
				</div>
				<div class="card-graph-item">
					<img src="img/cards/home.svg" width="24" height="24" alt="">
					${address}
				</div>
			</div>
			<div class="card-master-info">
				${about} ${skill}
			</div>
		</div>
		<div class="card-right">
			<div class="card-right-title">
				Адрес и области выезда
			</div>
			<div class="card-right-map">
				<iframe
					src="${map}" width="560" height="400" frameborder="1"
					allowfullscreen="true" style="position:relative;">
				</iframe>
			</div>
			<div class="card-right-item">
				Город <span>${town}</span>
			</div>
			<div class="card-right-item">
				Район <span>${dist}</span>
			</div>
			<div class="card-right-item">
				Метро <span>${metro}</span>
			</div> 
		</div>
		</div>
	</li>`
}

/**
 * Approve card as Admin.
 */
const approveCard = () => {
	const buttons = document.querySelectorAll( '.admin-approve-card' )

	if( ! buttons.length ) return

	buttons.forEach( button => {
		button.addEventListener( 'click', e => {
			e.preventDefault()

			if( ! confirm( 'Действительно одобрить?' ) ) return

			const
				card		= button.closest( '.card' ),
				cardId		= card.dataset.id || '',
				request		= new XMLHttpRequest(),
				formData	= new FormData()

			formData.append( 'func', 'approve-card' )
			formData.append( 'id', cardId )
			request.open( 'post', 'send-form.php', true )
			request.responseType = 'json'

			request.addEventListener( 'load', () => {
				if( request.status === 200 ){
					if( request.response.success ) card.remove()
					else console.error( request.response.message )
				}	else {
					console.error( request.response )
				}
			} )

			request.send( formData )
		} )
	} )
}

/**
 * Decline card as Admin.
 */
const declineCard = () => {
	const buttons = document.querySelectorAll( '.admin-delete-card' )

	if( ! buttons.length ) return

	buttons.forEach( button => {
		button.addEventListener( 'click', e => {
			e.preventDefault()

			if( ! confirm( 'Действительно удалить?' ) ) return

			const
				card		= button.closest( '.card' ),
				cardId		= card.dataset.id || '',
				request		= new XMLHttpRequest(),
				formData	= new FormData()

			formData.append( 'func', 'delete-card' )
			formData.append( 'id', cardId )
			request.open( 'post', 'send-form.php', true )
			request.responseType = 'json'

			request.addEventListener( 'load', () => {
				if( request.status === 200 ){
					if( request.response.success ) card.remove()
					else console.error( request.response.message )
				}	else {
					console.error( request.response )
				}
			} )

			request.send( formData )
		} )
	} )
}