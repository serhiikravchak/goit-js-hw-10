const BASE_URL = 'https://restcountries.com/v3.1/name';

export function fetchCountries(searchValue) {
  return fetch(`${BASE_URL}/${searchValue}?fields=capital,languages,name,flags,population`).then(resp => {
    if (!resp.ok) {
      throw new Error();
    }
    return resp.json();
  });
}