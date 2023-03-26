const STEP			= 5
let data			= [],
	filteredData	= [],
	filterTown		= '',
	filterDist		= '',
	filterMetro		= '',
	filterTech		= '',
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
		res = await fetch( '../src/data/data.json' )
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
 * Filter our data using input values and offset.
 */
const processFilters = ( scrolling = 0 ) => {
	if( ! scrolling ) offset = 0

	if( ! filterTown && ! filterDist && ! filterMetro && ! filterTech ){
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
		filteredData.forEach( ( { town, dist, metro, tech } ) => {
			structure += `<li class="card">
				<span class="card-town">${ town }</span>
				<span class="card-dist">${ dist }</span>
				<span class="card-metro">${ metro }</span>
				<span class="card-tech">${ tech }</span>
			</li>`
		} )
	}

	if( scrolling ) results.innerHTML += structure
	else results.innerHTML = structure
}

window.addEventListener( 'scroll', () => {
	const
		scrolled	= window.scrollY,
		results		= document.querySelector( '#results' )

	if(
		! results ||
		results.classList.contains( 'filtering' ) ||
		offset > filteredData.length ||
		scrolled < getCoords( results ).bottom - window.innerHeight + 200
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