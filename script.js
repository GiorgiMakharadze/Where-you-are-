'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, calssName = '') {
  const html = `
  
  <article class="country ${calssName}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} mln people</p>
      <p class="country__row"><span>🔊</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg = 'Somthing went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      err => reject(err)
    );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

btn.addEventListener('click', function () {
  const whereAmI = async function () {
    try {
      //Geolocation
      const pos = await getPosition();
      const { latitude: lat, longitude: lng } = pos.coords;

      // Reverse geocoding
      const resGeo = await fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json`
      );
      if (!resGeo.ok) throw new Error('🔧Problem getting location data');
      const dataGeo = await resGeo.json();

      // Country data
      const res = await fetch(
        `https://restcountries.com/v2/name/${dataGeo.country}`
      );
      if (!res.ok) throw new Error('🔧Problem getting country');

      const data = await res.json();
      renderCountry(data[0]);

      return `You are in ${dataGeo.city}, ${dataGeo.country}`;
    } catch (err) {
      console.error(`${err}`);
      renderError(`${err.message}`);
      throw err;
    }
  };

  console.log('1: location start');

  (async function () {
    try {
      const city = await whereAmI();
      console.log(`1: ${city}`);
    } catch (err) {
      console.error(`2: ${err.message}`);
    }
  })();
});
