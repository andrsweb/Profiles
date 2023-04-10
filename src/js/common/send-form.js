document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	submitForm( '.form' )
	submitForm( '.card-form' )
	submitForm( '.cards-form' )
	submitForm( '.feedback-form' )
} )

export const appendEmailData = () => {
	const popupBtn = document.querySelectorAll( '.card-email' )
	const form = document.querySelector( '.card-form' )

	if( ! popupBtn.length ) return
	
	popupBtn.forEach( button => {
		button.addEventListener( 'click', () => {

			form.setAttribute( 'data-master', button.dataset.mail )
			console.log( form.dataset.master )
		} )
	} )

	
}

const submitForm = ( selector ) => {
	const forms	= document.querySelectorAll( selector )

	if( ! forms.length ) return

	forms.forEach( form => {
		form.addEventListener( 'submit', e => {
			e.preventDefault()

			const
				formResponse	= form.querySelector( '.form-response' ),
				request			= new XMLHttpRequest(),
				formData		= new FormData( form ),
				formType		= form.dataset.type,
				isAdmin			= form.dataset.admin || '',
				cardId			= form.dataset.card || '',
				mail            = form.dataset.master || ''

			formData.append( 'func', formType )
			formData.append( 'admin', isAdmin )
			formData.append( 'card', cardId )
			formData.append( 'master', mail )
			request.open( 'post', 'send-form.php', true )
			request.responseType = 'json'

			formResponse.classList.remove( ['success', 'error'] )
			formResponse.textContent = 'Обработка...'

			request.addEventListener( 'load', () => {
				if( request.status === 200 ){
					if( request.response.success ){
						if( formType === 'admin-form' ) {
							formResponse.textContent = 'Анкета отправлена'
							form.reset()
							setTimeout(() => {
								formResponse.textContent = ''
							}, 4000);
						} else {
							form.classList.add( 'success' )
							form.classList.remove( 'error' )
							form.innerHTML = request.response.message
						}

						if( cardId ) setTimeout( () => window.location.reload(), 1000 )
					}	else {
						formResponse.classList.remove( 'success' )
						formResponse.classList.add( 'error' )
						formResponse.textContent = request.response.message
					}
				}	else {
					formResponse.classList.remove( 'success' )
					formResponse.classList.add( 'error' )
					formResponse.textContent = request.response
				}
			} )

			request.send( formData )
		} )
	} )
}