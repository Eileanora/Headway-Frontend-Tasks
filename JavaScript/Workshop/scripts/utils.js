function loadDropdowns(data) {
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

// TODO: Not working yet
function toggleOpenedMenu() {
  const openedDropdown = document.querySelector('.dropdown--opened');
  if (openedDropdown) {
    openedDropdown.classList.remove('dropdown--opened');
  }
  this.classList.toggle('dropdown--opened');
}

function selectCurrency(dropdownItem) {
  const currencyCode = dropdownItem.getAttribute('data-value');
  const currencyName = dropdownItem.textContent;
  const currencyDropdown = dropdownItem.closest('.dropdown');
  const currencyDropdownLabel = currencyDropdown.querySelector('.dropdown__text');
  const dropdownInput = currencyDropdown.querySelector('input[type="checkbox"]');

  // remove selected class from any element with the same data-value
  if (currencyDropdownLabel.hasAttribute('data-value')) {
    const previousCurrencyCode = currencyDropdownLabel.getAttribute('data-value');
    toggleSelectedItems(previousCurrencyCode, false);
  }

  currencyDropdownLabel.textContent = currencyName;
  currencyDropdownLabel.setAttribute('data-value', currencyCode);
  currencyDropdown.classList.add('dropdown--checked');
  dropdownInput.checked = false;
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

function getSelectedCurrencies(dropdownItem) {
  const selectedItems = document.querySelectorAll('.dropdown__item.dropdown--selected');
  return Array.from(selectedItems).map(item => item.getAttribute('data-value'));
}

// TODO: UnderDevelopment
function updateUI(selectedCurrencies) {
  const header = document.querySelector('.chart-header');
  // working
  if (header.classList.contains('d-none')) {
    header.classList.remove('d-none');
  }

  const currencyCode1 = selectedCurrencies[0];
  const currencyCode2 = selectedCurrencies[1];

  // not working
  addCurrencyFlag(currencyCode1, currencyCode2);

  // not working
  updateCurrencyLabel(currencyCode1, currencyCode2);
}

function updateCurrencyLabel(currencyCode1, currencyCode2) {
  const currencyLabel1 = document.querySelector('.currency-label--1');
  const currencyLabel2 = document.querySelector('.currency-label--2');

  currencyLabel1.textContent = currencyCode1;
  currencyLabel2.textContent = currencyCode2;
}

function removeFiClasses(element) {
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
