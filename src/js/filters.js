import { showPopup } from './popup'
import { showCardPopup } from './card-popup'

const STEP = 1
let data = [],
	filteredData = [],
	filterTown = '',
	filterDist = '',
	filterMetro = '',
	filterTech = '',
	offset = 0,
	tipsTown = [],
	tipsMetro = [],
	tipsTech = [],
	tipsDist = []

document.addEventListener('DOMContentLoaded', () => {
	'use strict'

	// 1. Get & show all data.
	getAllData().then(json => {
		if (Array.isArray(json)) {
			data = json
			filteredData = data.filter( card => card.approved === '1' )
			filteredData = filteredData.slice( offset, offset + STEP )
			generateCards()
		}
	})

	// 2. Add listeners for inputs.
	addListenersForInputs()

	// 3. Select tips.
	clickTip()
})

/**
 * Populate tips arrays with unique data.
 *
 * @param {string} filter
 */
const populateTips = (filter = '') => {
	// No specific filter - generate all tips.
	if (!filter) {
		tipsTown = []
		tipsMetro = []
		tipsDist = []
		tipsTech = []

		data.forEach(({ town, metro, dist, tech, approved }) => {
			if (town && town.includes(filterTown) && !tipsTown.includes(town)) tipsTown.push(town)

			if (metro && metro.includes(filterMetro) && !tipsMetro.includes(metro)) tipsMetro.push(metro)

			if (dist && dist.includes(filterDist) && !tipsDist.includes(dist)) tipsDist.push(dist)

			if (tech && tech.includes(filterTech) && !tipsTech.includes(tech)) tipsTech.push(tech)
		})

		generateTips(tipsTown, document.querySelector('.tips-town'))
		generateTips(tipsMetro, document.querySelector('.tips-metro'))
		generateTips(tipsDist, document.querySelector('.tips-dist'))
		generateTips(tipsTech, document.querySelector('.tips-tech'))
	} else {
		switch (filter) {
			case 'town':
				tipsTown = []
				data.forEach(({ town, approved }) => {
					if (approved === '1' && town.toLowerCase().includes(filterTown.toLowerCase()) && !tipsTown.includes(town)) tipsTown.push(town)
				})
				generateTips(tipsTown, document.querySelector('.tips-town'))
				break

			case 'metro':
				tipsMetro = []
				data.forEach(({ metro, approved }) => {
					if (approved === '1' && metro.toLowerCase().includes(filterMetro.toLowerCase()) && !tipsMetro.includes(metro)) tipsMetro.push(metro)
				})
				generateTips(tipsMetro, document.querySelector('.tips-metro'))
				break

			case 'dist':
				tipsDist = []
				data.forEach(({ dist, approved }) => {
					if (approved === '1' && dist.toLowerCase().includes(filterDist.toLowerCase()) && !tipsDist.includes(dist)) tipsDist.push(dist)
				})
				generateTips(tipsDist, document.querySelector('.tips-dist'))
				break

			case 'tech':
				tipsTech = []
				data.forEach(({ tech, approved }) => {
					if (approved === '1' && tech.toLowerCase().includes(filterTech.toLowerCase()) && !tipsTech.includes(tech)) tipsTech.push(tech)
				})
				generateTips(tipsTech, document.querySelector('.tips-tech'))
				break
		}
	}
}

/**
 * Output tips structure into HTML.
 *
 * @param {string[]} tipsData			Prepared array with tips data.
 * @param {HTMLObjectElement} tipsList	Wrapper where to output tips in HTML.
 */
const generateTips = (tipsData, tipsList) => {
	if (!tipsData.length || !tipsList) return

	let structure = ''

	tipsData.forEach(town => {
		structure += `<li class="tip">${town}</li>`
	})
	tipsList.innerHTML = structure
}

/**
 * Click on tip.
 */
const clickTip = () => {
	const tips = document.querySelectorAll('.tips')

	if (!tips.length) return

	tips.forEach(tipsList => {
		const filterWrapper = tipsList.closest('.filter')

		tipsList.addEventListener('click', e => {
			e.stopPropagation()

			const target = e.target

			if (target.classList.contains('tip')) {
				filterWrapper.querySelector('input').value = target.innerText
				filterWrapper.querySelector('input').dispatchEvent(new Event('input'))
				filterWrapper.classList.remove('active')
			}
		})
	})

	document.addEventListener('click', e => {
		e.stopPropagation()

		const target = e.target

		if ((target.className && !target.classList.contains('filter')) && !target.closest('.filter'))
			document.querySelectorAll('.filter').forEach(filter => filter.classList.remove('active'))
	})
}

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
 * Add listeners to inputs and get values for filters.
 */
const addListenersForInputs = () => {
	const inputs = document.querySelectorAll('input.search')

	if (!inputs.length) return

	inputs.forEach(input => {
		input.addEventListener('keyup', processInputChange)
		input.addEventListener('input', processInputChange)
		input.addEventListener('focus', showFiltersTips)
	})
}

/**
 * Input's callback to track changes.
 *
 * @param {Event} e
 */
const processInputChange = e => {
	const
		input = e.target,
		value = input.value || ''

	if (input.classList.contains('town')) {
		filterTown = value
		populateTips('town')
	}

	if (input.classList.contains('dist')) {
		filterDist = value
		populateTips('dist')
	}

	if (input.classList.contains('metro')) {
		filterMetro = value
		populateTips('metro')
	}

	if (input.classList.contains('tech')) {
		filterTech = value
		populateTips('tech')
	}

	processFilters()
}

/**
 * Filter our data using input values and offset
 */
const processFilters = (scrolling = 0) => {
	if (!scrolling) offset = 0

	filteredData = data.filter( card => card.approved === '1' )

	if (!filterTown && !filterDist && !filterMetro && !filterTech) {
		filteredData = filteredData.slice(offset, offset + STEP)
	} else {
		filteredData = filteredData.filter(({ town, dist, metro, tech }) => {
			return (
				(filterTown && town.toLowerCase().indexOf(filterTown.toLowerCase()) !== -1) ||
				(filterDist && dist.toLowerCase().indexOf(filterDist.toLowerCase()) !== -1) ||
				(filterMetro && metro.toLowerCase().indexOf(filterMetro.toLowerCase()) !== -1) ||
				(filterTech && tech.toLowerCase().indexOf(filterTech.toLowerCase()) !== -1)
			)
		})
		filteredData = filteredData.filter((item, index) => (index >= offset && index < offset + STEP))
	}

	generateCards(scrolling)
}

/**
 * Turn filtered data into HTML.
 */
const generateCards = scrolling => {
	const results = document.querySelector('#results')
	let structure = ''

	if (!results) return

	if (!filteredData.length) structure = scrolling ? '' : 'Ничего не найдено'
	else filteredData.forEach( card => structure += getCardStructure( card ) )

	if( scrolling ) results.innerHTML += structure
	else results.innerHTML = structure

	showPopup()
	showCardPopup()
	declineCard()
	showEditCardPopup()
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
 * @param online
 * @param map
 * @returns {string}	HTML structure of the card.
 */
const getCardStructure = ( { id, town, dist, metro, tech, name, src, skill, address, about, done, tel, rate, exp, gar, arrive, workTime, days, online, map } ) => {
	const
		isAdmin			= document.body.classList.contains( 'user-admin' ),
		contactButton	= isAdmin ? '' : '<button class="card-button card-btn-style"><img src="img/cards/pen.svg" width="24" height="24" alt=""> Оставить заявку</button>',
		deleteButton	= isAdmin ? '<button class="button card-btn-style admin-delete-card">Удалить</button>' : '',
		editButton		= isAdmin ? '<button class="button admin-edit-card card-btn-style popup-button">Редактировать</button>' : ''

	return `<li class="card" data-id="${ id }">
		<div class="card-inner"> 
			<div class="card-left">
				<div class="card-img">
					<img class="card-avatar" src="${src}" width="240" height="240" alt="">
				</div>
				<div class="card-rate">
					Рейтинг
					<img src="img/cards/star.svg" width="30" height="30" alt="">
					<span class="card-rating">${rate}</span>
				</div>
				<div class="card-buttons">
					<a class="card-phone card-btn-style card-tel" href="tel:${tel}">
						<img src="img/cards/phone.svg" width="24" height="24" alt="">
						${tel}
					</a>
					${ contactButton }
					<button class="card-btn-style">
						<img src="img/cards/thumbs.svg" width="24" height="24" alt="">
						Оставить отзыв
					</button>
					${ editButton }
					${ deleteButton }
				</div>
			</div>
			<div class="card-middle">
				<div class="card-name">
					${name}
					<span class="card-online">был в сети ${online}</span>
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
							<span class="card-done">
								${done}
							</span> 
						</div>			
					</div>
					<div class="card-about-item">
						<div class="card-about-title">
							Опыт работы
						</div>
						<div class="card-about-value">
							<span class="card-exp">${exp}</span> 
						</div>			
					</div>
					<div class="card-about-item">
						<div class="card-about-title">
							Гарантия
						</div>
						<div class="card-about-value">
							<span class="card-gar">${gar}</span>  
						</div>			
					</div>
					<div class="card-about-item">
						<div class="card-about-title">
							Выезд на дом
						</div>
						<div class="card-about-value">
							<span class="card-arrive"> ${arrive} </span>
						</div>			
					</div>
				</div>
				<div class="card-graph">
					<div class="card-graph-item">
						<img src="img/cards/date.svg" width="24" height="24" alt="">
						<span class="card-days">${days}</span>, <span class="card-worktime">${workTime}</span> 
					</div>
					<div class="card-graph-item">
						<img src="img/cards/home.svg" width="24" height="24" alt="">
						<span class="card-address">${address}</span>
					</div>
				</div>
				<div class="card-master-info">
					<span class="card-about">${about}</span><span class="card-skill">${skill}</span>
				</div>
			</div>
			<div class="card-right">
				<div class="card-right-title">
					Адрес и области выезда
				</div>
				<div class="card-right-map">
					<iframe class="card-map"
						src="${map}" width="560" height="400" frameborder="1"
						allowfullscreen="true" style="position:relative;">
					</iframe>
				</div>
				<div class="card-right-item">
					Город <span class="card-town">${town}</span>
				</div>
				<div class="card-right-item">
					Район <span class="card-dist">${dist}</span>
				</div>
				<div class="card-right-item">
					Метро <span class="card-metro">${metro}</span>
				</div> 
			</div>
		</div>
	</li>`
}

window.addEventListener('scroll', () => {
	const
		scrolled = window.scrollY,
		results = document.querySelector('#results')

	if (
		!results ||
		results.classList.contains('filtering') ||
		offset > data.length ||
		scrolled < getCoords(results).bottom - window.innerHeight + 40
	) return

	results.classList.add('filtering')
	offset += STEP
	processFilters(1)
	results.classList.remove('filtering')
})

/**
 * Get element offset.
 *
 * @param elem
 * @returns {{top: number, left: number, bottom: number, right: number}}
 */
const getCoords = elem => {
	let box = elem.getBoundingClientRect()

	return {
		top: box.top + window.pageYOffset,
		right: box.right + window.pageXOffset,
		bottom: box.bottom + window.pageYOffset,
		left: box.left + window.pageXOffset
	}
}

/**
 * Add/remove active class for focused filter.
 *
 * @param {Event} e
 */
const showFiltersTips = e => {
	const
		filtersWrappers = document.querySelectorAll('.filter'),
		filterWrapper = e.target.closest('.filter')

	filtersWrappers.forEach(filter => filter.classList.remove('active'))
	filterWrapper.classList.add('active')
	populateTips(e.target.className.replace('search ', ''))
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

/**
 * Show popup for card editing.
 */
const showEditCardPopup = () => {
	const
		buttons	= document.querySelectorAll( '.admin-edit-card' ),
		form	= document.querySelector( 'form[data-type="send-card"]' )

	if( ! buttons.length || ! form ) return

	const
		formFullName	= form.querySelector( 'input[name="full-name"]' ),
		formTown		= form.querySelector( 'input[name="town"]' ),
		formMetro		= form.querySelector( 'input[name="metro"]' ),
		formAddress		= form.querySelector( 'input[name="address"]' ),
		formTech		= form.querySelector( 'input[name="tech"]' ),
		formDist		= form.querySelector( 'input[name="dist"]' ),
		formSkill		= form.querySelector( 'input[name="skill"]' ),
		formExp			= form.querySelector( 'input[name="exp"]' ),
		formArrive		= form.querySelector( 'input[name="arrive"]' ),
		formDays		= form.querySelector( 'input[name="days"]' ),
		formGar			= form.querySelector( 'input[name="gar"]' ),
		formWorkTime	= form.querySelector( 'input[name="workTime"]' ),
		formTel			= form.querySelector( 'input[name="tel"]' ),
		formAbout		= form.querySelector( 'input[name="about"]' ),
		formOnline		= form.querySelector( 'input[name="online"]' ),
		formMap			= form.querySelector( 'input[name="map"]' )

	buttons.forEach( button => {
		button.addEventListener( 'click', e => {
			e.preventDefault()

			const
				card			= button.closest( '.card' ),
				cardId			= card.dataset.id || '',
				cardFullName	= card.querySelector( '.card-name' ).innerHTML.trim(),
				cardTown		= card.querySelector( '.card-town' ).innerHTML.trim(),
				cardMetro		= card.querySelector( '.card-metro' ).innerHTML.trim(),
				cardAddress		= card.querySelector( '.card-address' ).innerHTML.trim(),
				cardTech		= card.querySelector( '.card-tech' ).innerHTML.trim(),
				cardDist		= card.querySelector( '.card-dist' ).innerHTML.trim(),
				cardSkill		= card.querySelector( '.card-skill' ).innerHTML.trim(),
				cardExp			= card.querySelector( '.card-exp' ).innerHTML.trim(),
				cardArrive		= card.querySelector( '.card-arrive' ).innerHTML.trim(),
				cardDays		= card.querySelector( '.card-days' ).innerHTML.trim(),
				cardGar			= card.querySelector( '.card-gar' ).innerHTML.trim(),
				cardWorkTime	= card.querySelector( '.card-worktime' ).innerHTML.trim(),
				cardTel			= card.querySelector( '.card-tel' ).innerHTML.trim(),
				cardAbout		= card.querySelector( '.card-master-info .card-about' ).innerHTML.trim(),
				cardRate		= card.querySelector( '.card-rating' ).innerHTML.trim(),
				cardDone		= card.querySelector( '.card-done' ).innerHTML.trim(),
				online			= card.querySelector( '.card-online' ).innerHTML.trim(),
				map				= card.querySelector( '.card-map' ).innerHTML.trim()

			form.setAttribute( 'data-card', cardId )	// Add data-attr to know what card is in editing now.
			form.querySelector( 'legend' ).innerHTML = 'Редактировать анкету'	// Change legend text.

			// Add rate field.
			if( ! form.querySelector( 'input[name="rate"]' ) ){
				form.querySelector( '.popup-left' ).insertAdjacentHTML(
					'beforeend',
					`<input class="form-input" name="rate" type="text" placeholder="Рейтинг" value="${ cardRate || '' }" />`
				)
			}

			// Add map field.
			if( ! form.querySelector( 'input[name="map"]' ) ){
				form.querySelector( '.popup-left' ).insertAdjacentHTML(
					'beforeend',
					`<input class="form-input" name="map" type="text" placeholder="Src" value="${ map || '' }" />`
				)
			}

			// Add online field.
			if( ! form.querySelector( 'input[name="online"]' ) ){
				form.querySelector( '.popup-left' ).insertAdjacentHTML(
					'beforeend',
					`<input class="form-input" name="online" type="text" placeholder="Src" value="${ online || '' }" />`
				)
			}

			// Add done field.
			if( ! form.querySelector( 'input[name="done"]' ) ){
				form.querySelector( '.popup-right' ).insertAdjacentHTML(
					'beforeend',
					`<input class="form-input" name="done" type="text" placeholder="Сделано работ" value="${ cardDone || '' }" />`
				)
			}

			if( formFullName && cardFullName ) formFullName.value = cardFullName

			if( formTown && cardTown ) formTown.value = cardTown

			if( formMetro && cardMetro ) formMetro.value = cardMetro

			if( formAddress && cardAddress ) formAddress.value = cardAddress

			if( formTech && cardTech ) formTech.value = cardTech

			if( formDist && cardDist ) formDist.value = cardDist

			if( formSkill && cardSkill ) formSkill.value = cardSkill

			if( formExp && cardExp ) formExp.value = cardExp

			if( formArrive && cardArrive ) formArrive.value = cardArrive

			if( formDays && cardDays ) formDays.value = cardDays

			if( formGar && cardGar ) formGar.value = cardGar

			if( formWorkTime && cardWorkTime ) formWorkTime.value = cardWorkTime

			if( formTel && cardTel ) formTel.value = cardTel

			if( formAbout && cardAbout ) formAbout.value = cardAbout

			if( formOnline && online ) formOnline.value = online

			if( formMap && map ) formOnline.value = map
		} )
	} )
}