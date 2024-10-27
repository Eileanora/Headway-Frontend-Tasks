const apiKey = 'veFNNK3ewGzdiMCSZ1o0'
const baseUrl = 'https://marketdata.tradermade.com/api/v1'

const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    api_key: apiKey,
  },
})

export async function loadCurrencyList() {
  try {
    const response  = await apiClient.get('/live_currencies_list');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getTimeSeriesApi(params) {
  try {
    const response = await apiClient.get('/timeseries', {
      params: params,
      format: 'records',
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// function errorHandler(error) {
//   if()
// }
