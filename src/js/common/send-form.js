document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	submitForm( '.form' )
	submitForm( '.card-form' )
	submitForm( '.cards-form' )
} )

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
				formType		= form.dataset.type

			formData.append( 'func', formType )
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