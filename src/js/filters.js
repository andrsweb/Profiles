document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	searchByMatch()
} )

const searchByMatch = () => {
	const data = [
		{ town: "Москва", metro: "Люблино", tech: 'Компьютеры', dist: 'Арбат' },
		{ town: "Тула", metro: "Лубянка", tech: 'Ноутбуки', dist: 'Внуково' },
		{ town: "Архангельск", metro: "Театральное", tech: 'Персональный компьютер', dist: 'Кунцево' },
		{ town: "Новороссийск", metro: "Охотный ряд", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Москва", metro: "Арбатская", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Лубянка", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Арбат' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
		{ town: "Тула", metro: "Ясенево", tech: 'Ноутбуки', dist: 'Марфино' },
	]
	
	const search = document.querySelectorAll( '.search' )
	const results = document.getElementById( 'results' )
	let search_term = ''
	
	const showList = () => {
		results.innerHTML = ""
		data
			.filter( item => {
				return (
					item.metro.toLowerCase().includes( search_term ) ||
					item.town.toLowerCase().includes( search_term ) ||
					item.tech.toLowerCase().includes( search_term ) ||
					item.dist.toLowerCase().includes( search_term )
				)
			})
			.forEach( e => {
				const li = document.createElement( 'li' )
				li.innerHTML = `<i>Город:</i> ${ e.town } <i>Метро:</i> ${ e.metro } <i>Техника:</i> ${ e.tech } <i>Район:</i> ${ e.dist }`
				results.appendChild( li )
			} )
	}
	
	showList()
	
	search.forEach( el => {
		el.addEventListener( 'input', event => {
			search_term = event.target.value.toLowerCase()
			showList()
		} )
	} )
}

