import { useQuery } from 'react-query';
import ApexChart from 'react-apexcharts';

import { fetchCoinHistory } from '../api';

import { useRecoilValue } from 'recoil';
import { isDarkAtom } from '../atoms';

import styled from 'styled-components';

const ChartBox = styled.div`
  p {
    margin: 20px 0;
  }
`;

interface IHistory {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistory[]>(
    ['chart', coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );

  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <>
          <ChartBox>
            <p>Line Chart</p>
            <ApexChart
              type="line"
              series={[
                {
                  name: 'Price',
                  data: data?.map((price) => price.close) ?? [],
                },
              ]}
              options={{
                theme: { mode: isDark ? 'dark' : 'light' },
                chart: {
                  width: 500,
                  height: 500,
                  toolbar: { show: false },
                },
                xaxis: {
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  labels: { show: false },
                  type: 'datetime',
                  categories: data?.map((price) => price.time_close),
                },
                yaxis: { show: false },
                fill: {
                  type: 'gradient',
                  gradient: {
                    gradientToColors: ['#0be881'],
                    stops: [0, 100],
                  },
                },
                colors: ['#0fbcf9'],
                tooltip: {
                  y: {
                    formatter: (value) => `$${value.toFixed(2)}`,
                  },
                },
              }}
            />
          </ChartBox>
          <ChartBox>
            <p>Candle Chart</p>
            <ApexChart
              type="candlestick"
              series={[
                {
                  name: 'Price',
                  data:
                    data?.map((price) => ({
                      x: price.time_close,
                      y: [price.open, price.high, price.low, price.close],
                    })) ?? [],
                },
              ]}
              options={{
                theme: { mode: isDark ? 'dark' : 'light' },
                chart: {
                  width: 500,
                  height: 500,
                  toolbar: { show: false },
                },
                grid: { show: false },
                xaxis: {
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  labels: { show: false },
                  type: 'datetime',
                  categories: data?.map((price) => price.time_close),
                },
                yaxis: { show: false },
                plotOptions: {
                  candlestick: {
                    colors: {
                      upward: '#f90f5d',
                      downward: '#0fbcf9',
                    },
                  },
                },
                tooltip: {
                  y: {
                    formatter: (value) => `$${value.toFixed(2)}`,
                  },
                },
              }}
            />
          </ChartBox>
        </>
      )}
    </div>
  );
}

export default Chart;
