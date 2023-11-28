import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { setTargetElement, getTargetElement } from './common/global'


document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	showPopup('.popup-wrapper', '.popup-button','#body-lock' )
} )

export const showPopup = (wrapper, btn, lock) => {
	const popupWrapper    = document.querySelector( wrapper )
	const popButton       = document.querySelectorAll( btn )
	setTargetElement( document.querySelector( lock ) )

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
