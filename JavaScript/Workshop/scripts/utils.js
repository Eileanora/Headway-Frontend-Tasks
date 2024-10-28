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

const storageHelperFunctions = {
  setNestedValue: (obj, path, value) => {
    let keys = path.split('.');
    let lastKey = keys.pop();
    let lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, obj);
    lastObj[lastKey] = value;
  },
  getNestedValue: (obj, path) => {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  },
  calcExpiration: (currentDate, expiration) => {
    // expiration is in format (MM/HH/DD/MM)
    let [minutes, hours, days, months] = expiration.split('/');
    let expirationDate = new Date(currentDate);
    expirationDate.setMinutes(expirationDate.getMinutes() + parseInt(minutes));
    expirationDate.setHours(expirationDate.getHours() + parseInt(hours));
    expirationDate.setDate(expirationDate.getDate() + parseInt(days));
    expirationDate.setMonth(expirationDate.getMonth() + parseInt(months));
    return expirationDate;
  },
};

export function toggleErrorAndChart(showError) {
  const errorWrapper = document.querySelector('.error-wrapper');
  const chartContainer = document.querySelector('.chart-container');

  if (showError) {
    errorWrapper.classList.remove('d-none');
    chartContainer.classList.add('d-none');
  } else {
    errorWrapper.classList.add('d-none');
    chartContainer.classList.remove('d-none');
  }
}

function errorHandler(error) {
  const errorWrapper = document.querySelector('.error-wrapper');
  const statusMessage = errorWrapper.querySelector('.error-message');

  toggleErrorAndChart(true);
  let errorMessage;
  if (error.serverSide) {
    errorMessage = "An error occurred on the server side. Please try again later.";
  } else {
    errorMessage = error.errors;
  }
  // errors come in key: value pairs, keep the value and remove any irrelevant information
  if (typeof errorMessage === 'object') {
    errorMessage = Object.entries(errorMessage).map(([key, value]) => `${value}`);
    errorMessage = errorMessage.map(message => {
      const match = message.match(/[A-Z]/);
      if (match) {
        const index = match.index;
        return message.slice(0, index);
      }
      return message;
    });
  }
  if (Array.isArray(errorMessage)) {
    errorMessage = errorMessage.map(msg => `<li>${msg}</li>`).join('');
    errorMessage = `<ul class="d-flex flex-column align-items-center gap-1">${errorMessage}</ul>`;
    statusMessage.innerHTML = errorMessage;
  } else {
    statusMessage.innerHTML = '';
    statusMessage.textContent = errorMessage;
  }
}

export async function loadFromLocalStorage(key, apiCall, expirationDuration, ...apiParams) {
  let forexCurrencyConverter = JSON.parse(localStorage.getItem('forexCurrencyConverter')) || {};

  let item = storageHelperFunctions.getNestedValue(forexCurrencyConverter, key);
  let data;

  const expdate = storageHelperFunctions.getNestedValue(forexCurrencyConverter, `${key}.expirationDate`);
  const isExpired = storageHelperFunctions.getNestedValue(forexCurrencyConverter, `${key}.expirationDate`) < (new Date().toISOString());
  if (!item || item === 'undefined' || isExpired) {
    try {
      const response = await apiCall(...apiParams);
      const storedData = {
        data: response,
        savedDate: new Date(),
        expirationDate: storageHelperFunctions.calcExpiration(Date.now(), expirationDuration)
      };
      storageHelperFunctions.setNestedValue(forexCurrencyConverter, key, storedData);
      localStorage.setItem('forexCurrencyConverter', JSON.stringify(forexCurrencyConverter));
      data = response;
    } catch (error) {
      console.log('im working');
      errorHandler(error);
      throw new Error(error);
    }
  }
  if (!data) {
    data = item.data;
  }
  return data;
}

export async function getTimeSeriesData(currency, intervalValue) {
  const dates = calculateDates(intervalValue);
  const params = {
    currency,
    ...dates
  };

  const keyPath = `timeSeriesData.${currency}-${intervalValue}`;
  const expiration = app.intervals.find(interval => interval.value == intervalValue).expiration;
  let data = await loadFromLocalStorage(keyPath, getTimeSeriesApi, expiration, params);

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
