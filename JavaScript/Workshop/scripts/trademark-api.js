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
    if (response.data.error) {
      throw response;
    } else {
      return response.data;
    }

  } catch (error) {
    return errorHandler(error);
  }
}

function errorHandler(error) {
  let status, errors, serverSide;
  if (error.status === 200) {
    status = error.data.error;
    errors = error.data.message;
    serverSide = true;
  } else {
    status = error.status;
    errors = error.response.data.errors;
    serverSide = false;
  }

  // add regex to check for 5xx status codes
  const regex =  /^[5][0-9][0-9]$/
  if (regex.test(error.status)) {
    serverSide = true;
  }
  // Throw an error to stop the call stack
  throw {
    status,
    errors,
    serverSide,
  }
}
