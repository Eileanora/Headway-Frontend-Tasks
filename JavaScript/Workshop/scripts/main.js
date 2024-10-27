import { loadDropdowns, selectCurrency, updateUI, toggleOpenedMenu, setActive, getSelectedCurrencies, getTimeSeriesData } from './utils.js';
import { loadCurrencyList } from './trademark-api.js';
import { createChart, updateChart } from './chart-utils.js';

export const app = {
  intervals: [
    { value: "15m", interval: 'minute', period: 1, adjust: (date) => { date.setMinutes(date.getMinutes() - 15); date.setDate(date.getDate() - 1); } },
    { value: "1h", interval: 'minute', period: 5, adjust: (date) => { date.setHours(date.getHours() - 1); date.setDate(date.getDate() - 1); } },
    { value: "1d", interval: 'minute', period: 30, adjust: (date) => { date.setDate(date.getDate() - 2)} },
    { value: "1w", interval: 'hourly', period: 5, adjust: (date) => date.setDate(date.getDate() - 7) },
    { value: "1M", interval: 'daily', period: 1, adjust: (date) => date.setMonth(date.getMonth() - 1) }
  ],
};

// function loadFromLocalStorage(key, value, expiration=0, apiCall) {
//   let item = localStorage.getItem(key);
//   if (!item || item === 'undefined' || (item && item['expiration'] != 0)) { // if yes check if we are past the expiration date, store date saved along with expiration to calc
//     apiCall().then(data => {
//       localStorage.setItem(key, JSON.stringify(data));
//       // add expiration her
//     });
//   } else {
//     if 
//   }
// }

window.addEventListener('DOMContentLoaded', () => {
  // create chart
  const timeSeriesChart = createChart();
  // load data 
  let currencyList = localStorage.getItem('currencyList');
  if (!currencyList || currencyList === 'undefined') {
    loadCurrencyList().then(data => {
      localStorage.setItem('currencyList', JSON.stringify(data));
      loadDropdowns(data);
    });
  } else {
    const data = JSON.parse(localStorage.getItem('currencyList'));
    loadDropdowns(data);
  }

  // add event listeners for dropdown items
  const dropdownItems = document.querySelectorAll('.dropdown__item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      selectCurrency(item);
      let selectedCurrencies = getSelectedCurrencies(item);
      if (selectedCurrencies.length === 2) {
        updateUI(selectedCurrencies);
        const interval = document.querySelector('.interval.active');

        if (interval) {
          interval.click();
        }
      }
    })
  });

  // event listner for input checkboxs
  const checkboxes = document.querySelectorAll('.dropdown input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        toggleOpenedMenu(checkbox);
      } else {
        checkbox.classList.remove('dropdown--opened');
      }
    });
  });

  // add event listenrs for intervals 
  const chartIntervals = document.querySelectorAll('.interval');
  chartIntervals.forEach(interval => {
    interval.addEventListener('click', async () => {
      setActive(interval);
      const intervalValue = interval.getAttribute('data-interval');
      console.log(intervalValue);
      let selectedCurrencies = getSelectedCurrencies(interval);
      if (selectedCurrencies.length !== 2) {
        return;
      }
      selectedCurrencies = selectedCurrencies.map(currency => currency.toLowerCase()).join('');
      const newData = await getTimeSeriesData(selectedCurrencies, intervalValue);
      updateChart(timeSeriesChart, newData);
    });
  });

});
