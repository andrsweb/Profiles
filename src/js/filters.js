import { showPopup } from './popup'
import { showCardPopup } from './card-popup'

const STEP			= 1
let data			= [],
	filteredData	= [],
	filterTown		= '',
	filterDist		= '',
	filterMetro		= '',
	filterTech		= '',
	filterName		= '',
	offset			= 0,
	tipsTown		= [],
	tipsMetro		= [],
	tipsTech		= [],
	tipsDist		= []

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

	// 3. Select tips.
	clickTip()
} )

/**
 * Populate tips arrays with unique data.
 *
 * @param {string} filter
 */
const populateTips = ( filter = '' ) => {
	// No specific filter - generate all tips.
	if( ! filter ){
		tipsTown	= []
		tipsMetro	= []

		data.forEach( ( { town, metro, dist, tech } ) => {
			if( town && town.includes( filterTown ) && ! tipsTown.includes( town ) ) tipsTown.push( town )

			if( metro && metro.includes( filterMetro ) && ! tipsMetro.includes( metro ) ) tipsMetro.push( metro )

			if( dist && dist.includes( filterDist ) && ! tipsDist.includes( dist ) ) tipsDist.push( dist )

			if( tech && tech.includes( filterTech ) && ! tipsTech.includes( tech ) ) tipsTech.push( tech )
		} )

		generateTips( tipsTown, document.querySelector( '.tips-town' ) )
		generateTips( tipsMetro, document.querySelector( '.tips-metro' ) )
		generateTips( tipsDist, document.querySelector( '.tips-dist' ) )
		generateTips( tipsTech, document.querySelector( '.tips-tech' ) )
	}	else {
		switch( filter ){
			case 'town':
				tipsTown = []
				data.forEach( ( { town } ) => {
					if( town.toLowerCase().includes( filterTown.toLowerCase() ) && ! tipsTown.includes( town ) ) tipsTown.push( town )
				} )
				generateTips( tipsTown, document.querySelector( '.tips-town' ) )
				break

			case 'metro':
				tipsMetro = []
				data.forEach( ( { metro } ) => {
					if( metro.includes( filterMetro ) && ! tipsMetro.includes( metro ) ) tipsMetro.push( metro )
				} )
				generateTips( tipsMetro, document.querySelector( '.tips-metro' ) )
				break

			case 'dist':
				tipsDist = []
				data.forEach( ( { dist } ) => {
					if( dist.includes( filterDist ) && ! tipsDist.includes( dist ) ) tipsDist.push( dist )
				} )
				generateTips( tipsDist, document.querySelector( '.tips-dist' ) )
				break

			case 'tech':
				tipsTech = []
				data.forEach( ( { tech } ) => {
					if( tech.includes( filterTech ) && ! tipsTech.includes( tech ) ) tipsTech.push( tech )
				} )
				generateTips( tipsTech, document.querySelector( '.tips-tech' ) )
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
const generateTips = ( tipsData, tipsList ) => {
	if( ! tipsData.length || ! tipsList ) return

	let structure = ''

	tipsData.forEach( town => {
		structure += `<li class="tip">${ town }</li>`
	} )
	tipsList.innerHTML = structure
}

/**
 * Click on tip.
 */
const clickTip = () => {
	const tips = document.querySelectorAll( '.tips' )

	if( ! tips.length ) return

	tips.forEach( tipsList => {
		const filterWrapper = tipsList.closest( '.filter' )

		tipsList.addEventListener( 'click', e => {
			e.stopPropagation()

			const target = e.target

			if( target.classList.contains( 'tip' ) ){
				filterWrapper.querySelector( 'input' ).value = target.innerText
				filterWrapper.querySelector( 'input' ).dispatchEvent( new Event( 'input' ) )
				filterWrapper.classList.remove( 'active' )
			}
		} )
	} )

	document.addEventListener( 'click', e => {
		e.stopPropagation()

		const target = e.target

		if( ( target.className && ! target.classList.contains( 'filter' ) ) && ! target.closest( '.filter' ) )
			document.querySelectorAll( '.filter' ).forEach( filter => filter.classList.remove( 'active' ) )
	} )
}

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
		input.addEventListener( 'input', processInputChange )
		input.addEventListener( 'focus', showFiltersTips )
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

	if( input.classList.contains( 'town' ) ){
		filterTown = value
		populateTips( 'town' )
	}

	if( input.classList.contains( 'dist' ) ) {
		filterDist = value
		populateTips( 'dist' )
	} 

	if( input.classList.contains( 'metro' ) ){
		filterMetro = value
		populateTips( 'metro' )
	}

	if( input.classList.contains( 'tech' ) ) {
		filterTech = value
		populateTips( 'tech' )
	} 

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
					<div class="card-tech"><span class="first">Услуги:</span><span class="second">${ tech }</span></div>
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
		filtersWrappers	= document.querySelectorAll( '.filter' ),
		filterWrapper	= e.target.closest( '.filter' )

	filtersWrappers.forEach( filter => filter.classList.remove( 'active' ) )
	filterWrapper.classList.add( 'active' )
	populateTips( e.target.className.replace( 'search ', '' ) )
}