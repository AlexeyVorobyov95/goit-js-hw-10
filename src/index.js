import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(`input`, debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();
  const boxValue = refs.searchBox.value.trim();

  if (boxValue === '') {
    clearResult();
  }

  if (boxValue) {
    fetchCountries(boxValue)
      .then(getCountries)
      .catch(err => {
        Notify.failure('Oops, there is no country with that name');
        clearResult();
      });
  }
}

function getCountries(countries) {
  if (countries.length === 1) {
    const markup = countries.map(countries => countriesCard(countries));
    refs.countryInfo.innerHTML = markup.join('');
    refs.countryList.innerHTML = '';
  }

  if (countries.length > 1 && countries.length < 10) {
    const markup = countries.map(countries => countriesList(countries));
    refs.countryList.innerHTML = markup.join('');
    refs.countryInfo.innerHTML = '';
  }

  if (countries.length >= 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    clearResult();
  }
}

function countriesCard({ flags, name, capital, population, languages }) {
  return `
    
    <div class="country-info__box">
    <img class="country__flag" src="${flags.svg}" alt="${
    name.official
  }" width="50" />
    <h2 class="countrey__name">${name.official}</h2>
    </div>
    <p class="country__capital"><span class="country__info">Capital:</span> ${capital}</p>
    <p class="country__population"><span class="country__info">Population:</span> ${population}</p>
    <p class="country__language"><span class="country__info">Language:</span> ${Object.values(
      languages
    )}</p>
    `;
}

function countriesList({ flags, name }) {
  return `
     <li class="country-list__item">
      <img class="country-list__flag" src="${flags.svg}" alt="${name.official}" width="40" />
      <h2 class="country-list__name">${name.official}</h2>
    </li>
    `;
}

function clearResult() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
