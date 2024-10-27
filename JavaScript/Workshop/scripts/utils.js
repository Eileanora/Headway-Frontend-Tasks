import { getTimeSeriesApi } from './trademark-api.js';
import { getCurrencyCountry } from './currency-country.js';
import { getSymbolFromCurrency } from './currency-symbol-map.js';
import { app } from './main.js';

export function loadDropdowns(data) {
  const dropdowns = document.querySelectorAll('.dropdown__items');
  const currencies = data.available_currencies;

  dropdowns.forEach(dropdownItems => {
    Object.keys(currencies).forEach(currencyCode => {
      const listElement = document.createElement('li');
      listElement.classList.add('dropdown__item', 'dropdown--active');
      listElement.textContent = currencies[currencyCode];
      listElement.setAttribute('data-value', currencyCode);
      dropdownItems.appendChild(listElement);
    });
  });
}

export function toggleOpenedMenu(currentCheckbox) {
  const openedDropdown = document.querySelector('.dropdown--opened');
  if (openedDropdown) {
    openedDropdown.classList.remove('dropdown--opened');
    openedDropdown.checked = false;
  }
  currentCheckbox.classList.toggle('dropdown--opened');
}

export function selectCurrency(dropdownItem) {
  const currencyCode = dropdownItem.getAttribute('data-value');
  const currencyName = dropdownItem.textContent;
  const currencyDropdown = dropdownItem.closest('.dropdown');
  const currencyDropdownLabel = currencyDropdown.querySelector('.dropdown__text');
  const dropdownInput = currencyDropdown.querySelector('input[type="checkbox"]');

  if (currencyDropdownLabel.hasAttribute('data-value')) {
    const previousCurrencyCode = currencyDropdownLabel.getAttribute('data-value');
    toggleSelectedItems(previousCurrencyCode, false);
  }

  currencyDropdownLabel.textContent = currencyName;
  currencyDropdownLabel.setAttribute('data-value', currencyCode);
  currencyDropdown.classList.add('dropdown--checked');
  dropdownInput.checked = false;
  dropdownInput.classList.remove('dropdown--opened');
  toggleSelectedItems(currencyCode, true);
}

function toggleSelectedItems(currencyCode, selected) {
  const dropdownItems = document.querySelectorAll(`.dropdown__item[data-value="${currencyCode}"]`);
  dropdownItems.forEach(item => {
    if (selected) {
      item.classList.replace('dropdown--active', 'dropdown--selected');
    } else {
      item.classList.replace('dropdown--selected', 'dropdown--active');
    }
  });
}

export function getSelectedCurrencies(dropdownItem) {
  const selectedItems = document.querySelectorAll('.dropdown--checked .dropdown__text');
  return Array.from(selectedItems).map(item => item.getAttribute('data-value'));
}

export function updateUI(selectedCurrencies) {
  const header = document.querySelector('.chart-header');
  if (header.classList.contains('d-none')) {
    header.classList.remove('d-none');
  }

  const currencyCode1 = selectedCurrencies[0];
  const currencyCode2 = selectedCurrencies[1];

  addCurrencyFlag(currencyCode1, currencyCode2);
  updateCurrencyLabel(currencyCode1, currencyCode2);

}

function updateCurrencyLabel(currencyCode1, currencyCode2) {
  const currencyLabel1 = document.querySelector('.currency-label--1');
  const currencyLabel2 = document.querySelector('.currency-label--2');

  currencyLabel1.textContent = currencyCode1;
  currencyLabel2.textContent = currencyCode2;
}

export function removeFiClasses(element) {
  element.classList.forEach(className => {
    if (className.startsWith('fi-')) {
      element.classList.remove(className);
    }
  });
}

function addCurrencyFlag(currencyCode1, currencyCode2) {
  const currencyFlag1 = document.querySelector('.currency-flag--1');
  const currencyFlag2 = document.querySelector('.currency-flag--2');

  const alpha2Code1 = getCurrencyCountry(currencyCode1);
  const alpha2Code2 = getCurrencyCountry(currencyCode2);

  removeFiClasses(currencyFlag1);
  removeFiClasses(currencyFlag2);

  currencyFlag1.classList.add(`fi-${alpha2Code1.toLowerCase()}`);
  currencyFlag2.classList.add(`fi-${alpha2Code2.toLowerCase()}`);
}

function formatDate(date, includeTime) {
  let datePart = date.toISOString().split('T')[0];
  if (includeTime) {
    let timePart = date.toISOString().split('T')[1].split('.')[0].slice(0, -3);
    return datePart + '-' + timePart;
  }
  return datePart;
}

function calculateDates(intervalValue) {
  let start_date = new Date();
  let end_date = new Date();
  let interval, period;

  let selectedInterval = app.intervals.find(interval => interval.value == intervalValue);
  if (selectedInterval) {
    selectedInterval.adjust(start_date);
    interval = selectedInterval.interval;
    period = selectedInterval.period;
  }

  let includeTime = interval !== 'daily';

  return {
    start_date: formatDate(start_date, includeTime),
    end_date: formatDate(end_date, includeTime),
    interval: interval,
    period: period
  };
}

export function setActive(interval) {
  const activeInterval = document.querySelector('.interval.active');
  if (activeInterval) {
    activeInterval.classList.remove('active');
  }
  interval.classList.add('active');
}

function updateHeaderText(percentage, lastCloseVal) {
  const lastExchangeRate = document.querySelector('.exchange-rate');
  const percentageChange = document.querySelector('.rate-percentage');

  lastExchangeRate.textContent = lastCloseVal;
  percentageChange.textContent = percentage;
}

export async function getTimeSeriesData(currency, intervalValue) {
  const dates = calculateDates(intervalValue);
  const params = {
    currency,
    ...dates
  };

  console.log(params);
  let data = localStorage.getItem(`${currency}-${intervalValue}`);
  if (!data || data === 'undefined') {
    const response = await getTimeSeriesApi(params);
    localStorage.setItem(`${currency}-${intervalValue}`, JSON.stringify(response));
  }

  data = JSON.parse(localStorage.getItem(`${currency}-${intervalValue}`));
 
  console.log(data);
  console.log(data.quotes)
  let labels = data.quotes.map(entry => entry.date);
  let chartData = data.quotes.map(entry => entry.close);

  let change = (chartData.length > 1) ? (chartData[chartData.length - 1] - chartData[0]) / chartData[0] : 0;
  change = `${change.toFixed(7)} (${(change * 100).toFixed(7)}%)`;
  const lastCloseVal = getSymbolFromCurrency(currency.slice(-3)) + " " + chartData[chartData.length - 1];

  updateHeaderText(change, lastCloseVal);

  return {
    labels,
    data: chartData
  };
}
