

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