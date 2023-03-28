document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	submitForm()
} )

const submitForm = () => {
    const form         = document.querySelector( '.form' )
    const formResponse = form.querySelector( '.form-response' )

    form.addEventListener( 'submit', e => {

        e.preventDefault()

        const request = new XMLHttpRequest()

        request.open( 'post', 'send-form.php', true )

        const formData = new FormData( form )

        formResponse.classList.remove( [ 'success', 'error' ] )
        formResponse.textContent = 'Обработка...'
        request.addEventListener( 'load', () => {
            if  ( request.status === 200 ) {
                formResponse.classList.add( 'success' )
            } else {
                formResponse.classList.add( 'error' )
                console.error( request.response )
            }

            formResponse.textContent = request.response
        } )
        request.send( formData )
    } )
}