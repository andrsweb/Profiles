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
				<div class="card-row">
					<div class="card-col">
						<div class="card-name"><span class="first">ФИО:</span><span class="second">${name}</span>
						</div>
					</div>
					<div class="card-col">
						<div class="card-town"><span class="first">Город:</span><span class="second">${town}</span></div>
					</div>
					<div class="card-col">
						<div class="card-dist"><span class="first">Район:</span><span class="second">${dist}</span></div>
					</div>
				</div>
				<div class="card-row">
					<div class="card-col">
						<div class="span-wrapper-top"><span class="first">Метро:</span><span class="second">${metro || 'нет'}</span></div>
					</div>
					<div class="card-col">
						<div class="card-tech"><span class="first">Услуги:</span><span class="second">${tech}</span>
						</div>
					</div>
					<div class="card-col">
						<div class="card-tech"><span class="first">Адрес проживания:</span><span class="second">${address}</span></div>
					</div>
				</div>
				<div class="card-row">
					<div class="card-col">
						<div class="card-tech"><span class="first">Что умею делать:</span><span class="second">${skill}</span></div>
					</div>
					<div class="card-col">
						<div class="span-wrapper"><span class="first">Опыт:</span><span class="second">${exp}
							</span></div>
					</div>
					<div class="card-col">
						<div class="span-wrapper"><span class="first">Гарантия:</span><span class="second"> ${gar} </span></div>
					</div>
				</div>
				<div class="card-row">
					<div class="card-col">
						<div class="span-wrapper"><span class="first">Выезд:</span><span class="second"> ${arrive} </span></div>
					</div>
					<div class="card-col">
						<div class="span-wrapper"><span class="first">Время работы:</span><span class="second">${workTime} </span></div>
					</div>
					<div class="card-col">
						<div class="card-tech"><span class="first">Дни работы:</span><span class="second"> ${days}</span></div>
					</div>
				</div>
				<div class="card-row">
					<div class="card-col">
						<div class="card-about"><span class="first">Обо мне:</span><span
								class="second on">Показать</span>
							<div class="card-info">
								<div class="card-info-inner">
									${about}
								</div>
							</div>
						</div>
					</div>
					<div class="card-col">
						<a href="tel:${tel}" class="master-tel">
							<span class="first">
							Телефон:</span>${tel}
						</a>
					</div>
					<div class="card-col">
						<button class="button admin-approve-card">Одобрить</button>
						<button class="button admin-delete-card">Удалить</button>
					</div>
				</div>
			</div>
			<div class="card-photo">
				<img class="card-avatar" src="${src}" width="300" height="300" alt="">
				<p class="master-rate">
					Рейтинг: ${rate}
					<img src="img/cards/star.png" width="15" height="15" alt="">
				</p>
				<p class="done">
					Выполнено работ: ${done}
				</p>
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