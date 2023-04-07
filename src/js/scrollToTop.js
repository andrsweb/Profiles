import smoothscroll from 'smoothscroll-polyfill';

document.addEventListener( 'DOMContentLoaded', () => {
'use strict'

smoothscroll.polyfill()
scrollToTop()
} )

const scrollToTop = () => {

const scrollArrow = document.querySelector( '.scroll-img' )

window.addEventListener( 'scroll', () => {
	if( ! scrollArrow ) return

	let scrollTop = window.scrollY

	if ( scrollTop > 400 ) {
		scrollArrow.classList.add( 'scrolled' )
	} else {
		if ( scrollTop < 400 ) {
			scrollArrow.classList.remove( 'scrolled' )
		}
	}
})

scrollArrow.addEventListener( 'click', () => {
	window.scrollTo( {
		top: 0,
		behavior: 'smooth'
	} )
} )
}
