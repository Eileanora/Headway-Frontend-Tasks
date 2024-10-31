import { loadDropdowns, selectCurrency, updateUI, toggleOpenedMenu, setActive, getSelectedCurrencies, getTimeSeriesData, loadFromLocalStorage } from './utils.js';
import { loadCurrencyList } from './trademark-api.js';
import { createChart, updateChart } from './chart-utils.js';

export const app = {
  intervals: [
    { value: "15m", interval: 'minute', period: 1, expiration: '01/00/00/00',
      adjust: (date) => { date.setMinutes(date.getMinutes() - 15); date.setDate(date.getDate() - 1); } },
    { value: "1h", interval: 'minute', period: 5, expiration: '05/00/00/00',
      adjust: (date) => { date.setHours(date.getHours() - 1); date.setDate(date.getDate() - 1); } },
    { value: "1d", interval: 'minute', period: 30, expiration: '30/00/00/00',
      adjust: (date) => { date.setDate(date.getDate() - 2)} },
    { value: "1w", interval: 'hourly', period: 5, expiration: '00/05/00/00',
      adjust: (date) => date.setDate(date.getDate() - 7) },
    { value: "1M", interval: 'daily', period: 1, expiration: '00/00/01/00',
      adjust: (date) => date.setMonth(date.getMonth() - 1) }
  ],

  DOMElements : {
    dropdowns: document.getElementsByClassName('.dropdown'),
    rateChartContainer: document.getElementsByClassName('.chart-container'),
    rateChartHeader: document.getElementsByClassName('.chart-header'),
    errorWrapper: document.getElementsByClassName('.error-wrapper'),
  },
};

export const DOMChildElements = {
  dropdownItemsList: app.DOMElements.dropdowns.getElementsByClassName('.dropdown-items'),
  currencyIcons: app.DOMElements.rateChartHeader.getElementsByClassName('.curr-icons.fi'),
  currencyLabels: app.DOMElements.rateChartHeader.getElementsByClassName('.currency-label.currency-label__text'),
  intervals: app.DOMElements.rateChartContainer.getElementsByClassName('.interval'),
}

window.addEventListener('DOMContentLoaded', async () => {
  // create chart
  const timeSeriesChart = createChart();
  // load data
  let currencyList = await loadFromLocalStorage('currencyList', loadCurrencyList, '00/00/00/01');
  loadDropdowns(currencyList);

  // add event listeners for dropdown items
  const dropdownItems = DOMChildElements.dropdownItemsList.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      selectCurrency(item);
      let selectedCurrencies = getSelectedCurrencies(item);
      if (selectedCurrencies.length === 2) {
        updateUI(selectedCurrencies);
        const activeIntervals = app.intervals.filter(interval => interval.classList.includes('.active')); 

        if (interval) {
          interval.click();
        }
      }
    })
  });

  // event listner for input checkboxs
  // const checkboxes = document.querySelectorAll('.dropdown input[type="checkbox"]');
  const checkboxes = app.DOMElements.dropdowns.querySelectorAll('input[type="checkbox"]');
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
  const chartIntervals = DOMChildElements.intervals.intervals;
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
