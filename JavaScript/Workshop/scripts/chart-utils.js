export function createChart() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: true,
      borderColor: 'rgb(177, 214, 192)',
      backgroundColor: 'rgba(177, 214, 192, 0.5)',
      tension: 0,
      pointStyle: false,
    }],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      }
    },
    plugins: {
      legend: {
          display: false // This hides all text in the legend and also the labels.
      }
    }
  }

  const config = {
    type: 'line',
    data: data,
    options: options,
  };

  const ctx = document.getElementById('rate-chart');
  return new Chart(ctx, config);

}

export function updateChart(chart, data) {
  console.log(data);
  chart.data.labels = data['labels'];
  chart.data.datasets[0].data = data['data'];
  chart.update();
}
