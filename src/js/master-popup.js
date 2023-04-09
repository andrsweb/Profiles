import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { setTargetElement, getTargetElement } from './common/global'


document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	showMasterPopup()
} )

export const showMasterPopup = () => {
	const masterPopupWrapper    = document.querySelector( '.master-popup-wrapper' )
	const masterPopButton       = document.querySelectorAll( '.card-email' )
	setTargetElement( document.querySelector( '#master-body-lock' ) )

	if( ! masterPopupWrapper ) return

	masterPopButton.forEach( button => {
		button.addEventListener( 'click', () => {
			masterPopupWrapper.classList.add( 'showed' )
			disableBodyScroll( getTargetElement(), { reserveScrollBarGap: true } )
		} )
	} )

	masterPopupWrapper.addEventListener( 'click', e => {
		e.stopPropagation()

		const target = e.target

		if ( target.className && target.classList.contains( 'master-popup-wrapper' ) ) {
			masterPopupWrapper.classList.remove( 'showed' )
			enableBodyScroll( getTargetElement() )
		}
	} )
}
