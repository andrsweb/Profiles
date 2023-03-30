import smoothscroll from 'smoothscroll-polyfill';

document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	smoothscroll.polyfill()
	scrollToTop()
} )

const scrollToTop = () => {

	const scrollArrow = document.querySelector( '.col-img' )

	scrollArrow.addEventListener( 'click', () => {
		if( ! scrollArrow ) return

		window.scrollTo( {
			top: 0,
			behavior: 'smooth'
		} )
	} )
}
