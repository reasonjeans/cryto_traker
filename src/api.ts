const DEFAULT_URL = 'https://api.coinpaprika.com/v1';

export async function fetchCoins() {
  return fetch(`${DEFAULT_URL}/coins`).then((response) => response.json());
}

export async function fetchCoinInfo(coinId: string) {
  return fetch(`${DEFAULT_URL}/coins/${coinId}`).then((response) => response.json());
}

export async function fetchCoinTickers(coinId: string) {
  return fetch(`${DEFAULT_URL}/tickers/${coinId}`).then((response) => response.json());
}

export async function fetchCoinHistory(coinId: string) {
  return fetch(`https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`).then((response) =>
    response.json()
  );
}
