import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const russiaFlag = 'https://5.ua/media/pictures/original/246957.jpg?t=1649969229'


const refs = {
    countryList: document.querySelector('.country-list'),
    container: document.querySelector('.country-info'),
    searchBox: document.querySelector('#search-box'),
};


refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY))

function onInput(evt) {
    evt.preventDefault();

    const inputQuery = evt.target.value.trim().toLowerCase();

    if (inputQuery.length === 0) {
        return Notify.failure('Enter country');
    }

    fetchCountries(inputQuery).then(country => {
        clearMarkup();
        if (inputQuery === 'russia') {
            renderRussia(country)
        } else
        if (country.length === 1) {
            renderCountryItem(country);
            console.dir(country)
        } else if (country.length >= 2 && country.length <= 10) {
            renderCountryList(country);
        }  else {
            Notify.info('Too many matches found. Please enter a more specific name.');
        }
    }).catch(onFetchError);
}

function clearMarkup() {
    refs.container.innerHTML = '' ;
    refs.countryList.innerHTML = '' ;
}

function renderCountryItem([{ name, capital, population, flags, languages }]) {
    const markupCard = `<div class='country-box'>
  <img class='flag' src="${flags.svg}" alt="flags" width=30>
      <h2> ${name.official}</h2></div>
      <div><p class='country-text'><span class='country-span'>Capital: </span>${capital}</p>
      <p class='country-text'><span class='country-span'>Population: </span>${population}</p>      
      <p class='country-text'><span class='country-span'>Languages: </span>${Object.values(
        languages
        ).join(', ')}</p></div>`;
    refs.container.innerHTML = markupCard
}

function renderCountryList(country) {
    const markup = country
    .map(
      ({ name, flags }) =>
        `<li class='country-item'>
      <img class='flag' src="${flags.svg}" alt="flags" width=30>
      <h2 class='country-title'>${name.common}</h2>`
    )
        .join('');
    refs.countryList.innerHTML = markup;
}

function renderRussia([{ name, capital, population, flags, languages }]) {
     const russia = `<div class='country-box'>
        <img class='flag' src="${russiaFlag}" alt="flags" width=30>
      <h2> ${name.official}</h2></div>
      <div><p class='country-text'><span class='country-span'>Capital: </span>КИЇВ</p>
      <p class='country-text'><span class='country-span'>Population: </span>${population}</p>      
      <p class='country-text'><span class='country-span'>Languages: </span>Солов&#39;їна Українська</p>
        <h1 class="russia_title">РУССКИЙ ВОЕННЫЙ КОРАБЛЬ - ИДИ НАХУЙ</h1></div>`;
        refs.container.innerHTML = russia
}

function onFetchError(err) {
    Notify.failure('Oops, there is no country with that name')
};