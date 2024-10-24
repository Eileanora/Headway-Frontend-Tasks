const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: true,
    borderColor: 'rgb(177, 214, 192)',
    backgroundColor: 'rgba(177, 214, 192, 0.5)',
    tension: 0,
    pointStyle: false,
  }]
};

const config = {
  type: 'line',
  data: data,
};


const ctx = document.getElementById('rate-chart');

new Chart(ctx, config);


window.addEventListener('DOMContentLoaded', () => {
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
  const dropdowns = document.querySelectorAll('.dropdown__item');
  dropdowns.forEach(item => {
    item.addEventListener('click', () => {
      selectCurrency(item);
      let selectedCurrencies = getSelectedCurrencies(item);
      if (selectedCurrencies.length === 2) {
        updateUI(selectedCurrencies);
      }
    })
  });

});
