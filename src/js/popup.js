import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { setTargetElement, getTargetElement } from './common/global'


document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	showPopup()
} )

export const showPopup = () => {
	const popupWrapper    = document.querySelector( '.popup-wrapper' )
	const popButton       = document.querySelectorAll( '.popup-button' )
	setTargetElement( document.querySelector( '#body-lock' ) )

	if( ! popupWrapper ) return

	popButton.forEach( button => {
		button.addEventListener( 'click', () => {
			popupWrapper.classList.add( 'showed' )
			disableBodyScroll( getTargetElement(), { reserveScrollBarGap: true } )
		} )
	} )

	popupWrapper.addEventListener( 'click', e => {
		e.stopPropagation()

		const target = e.target

		if ( target.className && target.classList.contains( 'popup-wrapper' ) ) {
			popupWrapper.classList.remove( 'showed' )
			enableBodyScroll( getTargetElement() )
		}
	} )
}
