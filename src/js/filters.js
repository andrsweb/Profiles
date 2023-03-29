import { showPopup } from "./popup"
import { showCardPopup } from "./card-popup"

const STEP			= 1
let data			= [],
	filteredData	= [],
	filterTown		= '',
	filterDist		= '',
	filterMetro		= '',
	filterTech		= '',
	filterName		= '',
	offset			= 0

document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	// 1. Get & show all data.
	getAllData().then( json => {
		if( Array.isArray( json ) ){
			data 			= json
			filteredData	= data.slice( offset, offset + STEP )
			generateCards()
		}
	} )

	// 2. Add listeners for inputs.
	addListenersForInputs()
} )

/**
 * Just get all data from json file.
 *
 * @returns {Promise<any>}
 */
const getAllData = async () => {
	let res

	try {
		res = await fetch( 'data/data.json' )
	}	catch( err ){
		console.error( `Error: ${ err.message }` )
		return
	}

	return await res.json()
}

/**
 * Add listeners to inputs and get values for filters.
 */
const addListenersForInputs = () => {
	const inputs = document.querySelectorAll( 'input.search' )

	if( ! inputs.length ) return

	inputs.forEach( input => {
		input.addEventListener( 'keyup', processInputChange )
		input.addEventListener( 'change', processInputChange )
		input.addEventListener( 'blur', processInputChange )
	} )
}

/**
 * Input's callback to track changes.
 *
 * @param {Event} e
 */
const processInputChange = e => {
	const
		input	= e.target,
		value	= input.value || ''

	if( input.classList.contains( 'town' ) ) filterTown = value

	if( input.classList.contains( 'dist' ) ) filterDist = value

	if( input.classList.contains( 'metro' ) ) filterMetro = value

	if( input.classList.contains( 'tech' ) ) filterTech = value

	processFilters()
}

/**
 * Filter our data using input values and offset
 * 
 */
const processFilters = ( scrolling = 0 ) => {
	if( ! scrolling ) offset = 0

	if( ! filterTown && ! filterDist && ! filterMetro && ! filterTech && ! filterName ){
		filteredData = data.slice( offset, offset + STEP )
	}	else {
		filteredData = data.filter( ( { town, dist, metro, tech } ) => {
			return (
				( filterTown && town.toLowerCase().indexOf( filterTown.toLowerCase() ) !== -1 ) ||
				( filterDist && dist.toLowerCase().indexOf( filterDist.toLowerCase() ) !== -1 ) ||
				( filterMetro && metro.toLowerCase().indexOf( filterMetro.toLowerCase() ) !== -1 ) ||
				( filterTech && tech.toLowerCase().indexOf( filterTech.toLowerCase() ) !== -1 )
			)
		} )

		filteredData = filteredData.filter( ( item, index ) => ( index >= offset && index < offset + STEP ) )
	}

	generateCards( scrolling )
}

/**
 * Turn filtered data into HTML.
 */
const generateCards = scrolling => {
	const results	= document.querySelector( '#results' )
	let structure	= ''

	if( ! results ) return

	if( ! filteredData.length ){
		structure = scrolling ? '' : 'Ничего не найдено'
	}	else {
		filteredData.forEach( ( { town, dist, metro, tech, name, src, skill, address, about, done, tel, rate, exp } ) => {
			structure += `<li class="card">
				<div class="card-inner">
					<div class="card-name"><span class="first">ФИО:</span><span class="second">${ name }</span></div>
					<div class="card-tech add">
						<div class="span-wrapper-top"><span class="first-town">Город:</span><span class="second-town">${ town }</span></div>
						<div class="span-wrapper-top"><span class="first-dist">Район:</span><span class="second-dist">${ dist }</span></div>
						<div class="span-wrapper-top"><span class="first-metro">Метро:</span><span class="second-metro">${ metro }</span></div>
					</div>
					<div class="card-tech"><span class="first">Техника:</span><span class="second">${ tech }</span></div>
					<div class="card-tech"><span class="first">Адрес проживания:</span><span class="second">${ address }</span></div>
					<div class="card-tech"><span class="first">Что умею делать:</span><span class="second">${ skill }</span></div>
					<div class="card-tech add">
						<div class="span-wrapper">
							<span class="first-exp">Опыт:</span><span class="second-town">${ exp } </span>
						</div>
						<div class="span-wrapper">
							<span class="first-gar">Гарантия:</span><span class="second-dist"> 1 мес. </span>
						</div>
					</div>
					<div class="card-tech add">
						<div class="span-wrapper"><span class="first-exp">Выезд:</span><span class="second-town">Да </span></div>
						<div class="span-wrapper"><span class="first-gar">Время работы:</span><span class="second-dist">8:00 - 21:00 </span></div>
					</div>
					<div class="card-tech"><span class="first">Дни работы:</span><span class="second">Понедельник-воскресенье </span></div>
					<div class="card-about"><span class="first">Обо мне:</span><span class="second on">Показать</span>
					<div class="card-info">
						<div class="card-info-inner">
							${ about }
						</div>
					</div>
					</div>
				</div>
				<div class="card-photo">
					<img class="card-avatar" src="${ src }" width="300" height="300" alt="">
					<p class="master-rate">
						Рейтинг: ${ rate }
						<img src="img/cards/star.png" width="15" height="15" alt="">
					</p>
					<p class="done">
						Выполнено работ: ${ done }
					</p>
					<div class="card-button-wrapper">
						<a href="tel:${ tel }" class="master-tel">
							${ tel }
						</a>
						<button class="card-button">
								Оставить заявку
						</button>
					</div>
				</div>
			</li>`
		} )
	}

	const showText = () => {
		const hiddenTexts = document.querySelectorAll( '.card-about' )
		const changeText = document.querySelector( '.second.on' )
	
		hiddenTexts.forEach( text => {
			text.addEventListener( 'click', () => {
				if( ! text.classList.contains( 'opened' ) ) {
					text.classList.add( 'opened' )
					changeText.innerHTML ="Скрыть"
				} else {
					text.classList.remove( 'opened' )
					changeText.innerHTML ="Показать"
				}
			} )
		} )
	}

	if( scrolling ) {
		results.innerHTML += structure
		showText()
		showPopup()
		showCardPopup()
	} 
	else {
		results.innerHTML = structure
		showText()
		showPopup()
		showCardPopup()
	} 
}

window.addEventListener( 'scroll', () => {
	const
		scrolled	= window.scrollY,
		results		= document.querySelector( '#results' )

	if(
		! results ||
		results.classList.contains( 'filtering' ) ||
		offset > data.length ||
		scrolled < getCoords( results ).bottom - window.innerHeight + 40
	) return

	results.classList.add( 'filtering' )
	offset += STEP
	processFilters( 1 )
	results.classList.remove( 'filtering' )
} )

const getCoords = elem => {
	let box = elem.getBoundingClientRect()

	return {
		top: box.top + window.pageYOffset,
		right: box.right + window.pageXOffset,
		bottom: box.bottom + window.pageYOffset,
		left: box.left + window.pageXOffset
	}
}