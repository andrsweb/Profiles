import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { setTargetElement, getTargetElement } from './common/global'


document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	showCardPopup()
} )

export const showCardPopup = () => {
	const cardPopupWrapper    = document.querySelector( '.card-popup-wrapper' )
	const cardPopButton       = document.querySelectorAll( '.card-button' )
	setTargetElement( document.querySelector( '#card-body-lock' ) )

	if( ! cardPopupWrapper ) return

	cardPopButton.forEach( button => {
		button.addEventListener( 'click', () => {
			cardPopupWrapper.classList.add( 'showed' )
			disableBodyScroll( getTargetElement(), { reserveScrollBarGap: true } )
		} )
	} )

	cardPopupWrapper.addEventListener( 'click', e => {
		e.stopPropagation()

		const target = e.target

		if ( target.className && target.classList.contains( 'card-popup-wrapper' ) ) {
			cardPopupWrapper.classList.remove( 'showed' )
			enableBodyScroll( getTargetElement() )
		}
	} )
}
