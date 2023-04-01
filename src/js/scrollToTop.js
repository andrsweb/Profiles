import smoothscroll from 'smoothscroll-polyfill';

document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	smoothscroll.polyfill()
	scrollToTop()
} )

const scrollToTop = () => {

	const scrollArrow = document.querySelector( '.col-img' )

	if( ! scrollArrow ) return

	scrollArrow.addEventListener( 'click', () => {

		window.scrollTo( {
			top: 0,
			behavior: 'smooth'
		} )
	} )
}
