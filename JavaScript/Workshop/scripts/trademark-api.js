apiKey = 'veFNNK3ewGzdiMCSZ1o0'
baseUrl = 'https://marketdata.tradermade.com/api/v1'

const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    api_key: apiKey,
  },
})

async function loadCurrencyList() {
  try {
    const response  = await apiClient.get('/live_currencies_list');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// function errorHandler(error) {
//   if()
// }
