import { showPopup } from './popup'
import { showCardPopup } from './card-popup'

const STEP = 1
let data = [],
	filteredData = [],
	filterTown = '',
	filterDist = '',
	filterMetro = '',
	filterTech = '',
	offset = 0,
	tipsTown = [],
	tipsMetro = [],
	tipsTech = [],
	tipsDist = []

document.addEventListener('DOMContentLoaded', () => {
	'use strict'

	// 1. Get & show all data.
	getAllData().then(json => {
		if (Array.isArray(json)) {
			data = json
			filteredData = data.filter( card => card.approved === '1' )
			filteredData = filteredData.slice( offset, offset + STEP )
			generateCards()
		}
	})

	// 2. Add listeners for inputs.
	addListenersForInputs()

	// 3. Select tips.
	clickTip()
})

/**
 * Populate tips arrays with unique data.
 *
 * @param {string} filter
 */
const populateTips = (filter = '') => {
	// No specific filter - generate all tips.
	if (!filter) {
		tipsTown = []
		tipsMetro = []
		tipsDist = []
		tipsTech = []

		data.forEach(({ town, metro, dist, tech, approved }) => {
			if (town && town.includes(filterTown) && !tipsTown.includes(town)) tipsTown.push(town)

			if (metro && metro.includes(filterMetro) && !tipsMetro.includes(metro)) tipsMetro.push(metro)

			if (dist && dist.includes(filterDist) && !tipsDist.includes(dist)) tipsDist.push(dist)

			if (tech && tech.includes(filterTech) && !tipsTech.includes(tech)) tipsTech.push(tech)
		})

		generateTips(tipsTown, document.querySelector('.tips-town'))
		generateTips(tipsMetro, document.querySelector('.tips-metro'))
		generateTips(tipsDist, document.querySelector('.tips-dist'))
		generateTips(tipsTech, document.querySelector('.tips-tech'))
	} else {
		switch (filter) {
			case 'town':
				tipsTown = []
				data.forEach(({ town, approved }) => {
					if (approved === '1' && town.toLowerCase().includes(filterTown.toLowerCase()) && !tipsTown.includes(town)) tipsTown.push(town)
				})
				generateTips(tipsTown, document.querySelector('.tips-town'))
				break

			case 'metro':
				tipsMetro = []
				data.forEach(({ metro, approved }) => {
					if (approved === '1' && metro.toLowerCase().includes(filterMetro.toLowerCase()) && !tipsMetro.includes(metro)) tipsMetro.push(metro)
				})
				generateTips(tipsMetro, document.querySelector('.tips-metro'))
				break

			case 'dist':
				tipsDist = []
				data.forEach(({ dist, approved }) => {
					if (approved === '1' && dist.toLowerCase().includes(filterDist.toLowerCase()) && !tipsDist.includes(dist)) tipsDist.push(dist)
				})
				generateTips(tipsDist, document.querySelector('.tips-dist'))
				break

			case 'tech':
				tipsTech = []
				data.forEach(({ tech, approved }) => {
					if (approved === '1' && tech.toLowerCase().includes(filterTech.toLowerCase()) && !tipsTech.includes(tech)) tipsTech.push(tech)
				})
				generateTips(tipsTech, document.querySelector('.tips-tech'))
				break
		}
	}
}

/**
 * Output tips structure into HTML.
 *
 * @param {string[]} tipsData			Prepared array with tips data.
 * @param {HTMLObjectElement} tipsList	Wrapper where to output tips in HTML.
 */
const generateTips = (tipsData, tipsList) => {
	if (!tipsData.length || !tipsList) return

	let structure = ''

	tipsData.forEach(town => {
		structure += `<li class="tip">${town}</li>`
	})
	tipsList.innerHTML = structure
}

/**
 * Click on tip.
 */
const clickTip = () => {
	const tips = document.querySelectorAll('.tips')

	if (!tips.length) return

	tips.forEach(tipsList => {
		const filterWrapper = tipsList.closest('.filter')

		tipsList.addEventListener('click', e => {
			e.stopPropagation()

			const target = e.target

			if (target.classList.contains('tip')) {
				filterWrapper.querySelector('input').value = target.innerText
				filterWrapper.querySelector('input').dispatchEvent(new Event('input'))
				filterWrapper.classList.remove('active')
			}
		})
	})

	document.addEventListener('click', e => {
		e.stopPropagation()

		const target = e.target

		if ((target.className && !target.classList.contains('filter')) && !target.closest('.filter'))
			document.querySelectorAll('.filter').forEach(filter => filter.classList.remove('active'))
	})
}

/**
 * Just get all data from json file.
 *
 * @returns {Promise<any>}
 */
const getAllData = async () => {
	let res

	try {
		res = await fetch('data/data.json')
	} catch (err) {
		console.error(`Error: ${err.message}`)
		return
	}

	return await res.json()
}

/**
 * Add listeners to inputs and get values for filters.
 */
const addListenersForInputs = () => {
	const inputs = document.querySelectorAll('input.search')

	if (!inputs.length) return

	inputs.forEach(input => {
		input.addEventListener('keyup', processInputChange)
		input.addEventListener('input', processInputChange)
		input.addEventListener('focus', showFiltersTips)
	})
}

/**
 * Input's callback to track changes.
 *
 * @param {Event} e
 */
const processInputChange = e => {
	const
		input = e.target,
		value = input.value || ''

	if (input.classList.contains('town')) {
		filterTown = value
		populateTips('town')
	}

	if (input.classList.contains('dist')) {
		filterDist = value
		populateTips('dist')
	}

	if (input.classList.contains('metro')) {
		filterMetro = value
		populateTips('metro')
	}

	if (input.classList.contains('tech')) {
		filterTech = value
		populateTips('tech')
	}

	processFilters()
}

/**
 * Filter our data using input values and offset
 */
const processFilters = (scrolling = 0) => {
	if (!scrolling) offset = 0

	filteredData = data.filter( card => card.approved === '1' )

	if (!filterTown && !filterDist && !filterMetro && !filterTech) {
		filteredData = filteredData.slice(offset, offset + STEP)
	} else {
		filteredData = filteredData.filter(({ town, dist, metro, tech }) => {
			return (
				(filterTown && town.toLowerCase().indexOf(filterTown.toLowerCase()) !== -1) ||
				(filterDist && dist.toLowerCase().indexOf(filterDist.toLowerCase()) !== -1) ||
				(filterMetro && metro.toLowerCase().indexOf(filterMetro.toLowerCase()) !== -1) ||
				(filterTech && tech.toLowerCase().indexOf(filterTech.toLowerCase()) !== -1)
			)
		})
		filteredData = filteredData.filter((item, index) => (index >= offset && index < offset + STEP))
	}

	generateCards(scrolling)
}

/**
 * Turn filtered data into HTML.
 */
const generateCards = scrolling => {
	const results = document.querySelector('#results')
	let structure = ''

	if (!results) return

	if (!filteredData.length) structure = scrolling ? '' : 'Ничего не найдено'
	else filteredData.forEach( card => structure += getCardStructure( card ) )

	const showText = () => {
		const hiddenTexts = document.querySelectorAll('.card-about')
		const changeText = document.querySelector('.second.on')

		hiddenTexts.forEach(text => {
			text.addEventListener('click', () => {
				if (!text.classList.contains('opened')) {
					text.classList.add('opened')
					changeText.innerHTML = "Скрыть"
				} else {
					text.classList.remove('opened')
					changeText.innerHTML = "Показать"
				}
			})
		})
	}

	if (scrolling) {
		results.innerHTML += structure
		showText()
		showPopup()
		showCardPopup()
	}
	else {
		results.innerHTML = structure
		showText()
		showPopup()
		showCardPopup()
	}
}

/**
 * Get HTML structure of the card.
 *
 * @param town
 * @param dist
 * @param metro
 * @param tech
 * @param name
 * @param src
 * @param skill
 * @param address
 * @param about
 * @param done
 * @param tel
 * @param rate
 * @param exp
 * @param gar
 * @param arrive
 * @param workTime
 * @param days
 * @returns {string}	HTML structure of the card.
 */
const getCardStructure = ( { town, dist, metro, tech, name, src, skill, address, about, done, tel, rate, exp, gar, arrive, workTime, days } ) => {
	return `<li class="card">
		<div class="card-inner">
			<div class="card-left">
				<div class="card-row">
					<div class="card-col">
						<div class="card-name"><span class="first">ФИО:</span><span class="second">${name}</span>
						</div>
					</div>
					<div class="card-col">
						<div class="card-town"><span class="first">Город:</span><span class="second">${town}</span></div>
					</div>
					<div class="card-col">
						<div class="card-dist"><span class="first">Район:</span><span class="second">${dist}</span></div>
					</div>
				</div>
				<div class="card-row">
					<div class="card-col">
						<div class="span-wrapper-top"><span class="first">Метро:</span><span class="second">${metro || 'нет'}</span></div>
					</div>
					<div class="card-col">
						<div class="card-tech"><span class="first">Услуги:</span><span class="second">${tech}</span>
						</div>
					</div>
					<div class="card-col">
						<div class="card-tech"><span class="first">Адрес проживания:</span><span class="second">${address}</span></div>
					</div>
				</div>
				<div class="card-row">
					<div class="card-col">
						<div class="card-tech"><span class="first">Что умею делать:</span><span class="second">${skill}</span></div>
					</div>
					<div class="card-col">
						<div class="span-wrapper"><span class="first">Опыт:</span><span class="second">${exp}
							</span></div>
					</div>
					<div class="card-col">
						<div class="span-wrapper"><span class="first">Гарантия:</span><span class="second"> ${gar} </span></div>
					</div>
				</div>
				<div class="card-row">
					<div class="card-col">
						<div class="span-wrapper"><span class="first">Выезд:</span><span class="second"> ${arrive} </span></div>
					</div>
					<div class="card-col">
						<div class="span-wrapper"><span class="first">Время работы:</span><span class="second">${workTime} </span></div>
					</div>
					<div class="card-col">
						<div class="card-tech"><span class="first">Дни работы:</span><span class="second"> ${days}</span></div>
					</div>
				</div>
				<div class="card-row">
					<div class="card-col">
						<div class="card-about"><span class="first">Обо мне:</span><span
								class="second on">Показать</span>
							<div class="card-info">
								<div class="card-info-inner">
									${about}
								</div>
							</div>
						</div>
					</div>
					<div class="card-col">
							<a href="tel:${tel}" class="master-tel">
								<span class="first">
								Телефон:</span>${tel}
							</a>
					</div>
					<div class="card-col">
						<button class="card-button">
							Оставить заявку
						</button>
					</div>
				</div>
			</div>
			<div class="card-photo">
				<img class="card-avatar" src="${src}" width="300" height="300" alt="">
				<p class="master-rate">
					Рейтинг: ${rate}
					<img src="img/cards/star.png" width="15" height="15" alt="">
				</p>
				<p class="done">
					Выполнено работ: ${done}
				</p>
			</div>
		</div>
	</li>`
}

window.addEventListener('scroll', () => {
	const
		scrolled = window.scrollY,
		results = document.querySelector('#results')

	if (
		!results ||
		results.classList.contains('filtering') ||
		offset > data.length ||
		scrolled < getCoords(results).bottom - window.innerHeight + 40
	) return

	results.classList.add('filtering')
	offset += STEP
	processFilters(1)
	results.classList.remove('filtering')
})

/**
 * Get element offset.
 *
 * @param elem
 * @returns {{top: number, left: number, bottom: number, right: number}}
 */
const getCoords = elem => {
	let box = elem.getBoundingClientRect()

	return {
		top: box.top + window.pageYOffset,
		right: box.right + window.pageXOffset,
		bottom: box.bottom + window.pageYOffset,
		left: box.left + window.pageXOffset
	}
}

/**
 * Add/remove active class for focused filter.
 *
 * @param {Event} e
 */
const showFiltersTips = e => {
	const
		filtersWrappers = document.querySelectorAll('.filter'),
		filterWrapper = e.target.closest('.filter')

	filtersWrappers.forEach(filter => filter.classList.remove('active'))
	filterWrapper.classList.add('active')
	populateTips(e.target.className.replace('search ', ''))
}