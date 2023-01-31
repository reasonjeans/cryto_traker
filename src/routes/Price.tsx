import { useEffect, useState } from 'react';

import { PriceData } from './Coin';

import styled from 'styled-components';

const Overview = styled.div`
  padding: 30px 20px;
  background: ${(props) => props.theme.boxColor};
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
`;

const Arrow = styled.span<{ isPos: boolean }>`
  font-size: 25px;
  color: ${(props) => (props.isPos ? props.theme.greenColor : props.theme.redColor)};
`;

const Amount = styled.div`
  margin: 0 25px 0 10px;
  display: inline-block;
  font-size: 25px;
`;

const Diff = styled.div<{ isPos: boolean }>`
  margin-right: 70px;
  padding-top: 3px;
  display: inline-block;
  font-size: 20px;
  color: ${(props) => (props.isPos ? props.theme.greenColor : props.theme.redColor)};
`;

interface PriceProps {
  coinId: string;
  tikersData?: PriceData;
}

function Price({ coinId, tikersData }: PriceProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PriceData>();
  useEffect(() => {
    setData(tikersData);
    setIsLoading(false);
  }, [coinId, tikersData]);

  const result = data?.quotes?.USD;
  const isPos = result?.percent_change_24h ? result?.percent_change_24h > 0 : false;

  return (
    <div>
      {isLoading ? (
        'Loading price...'
      ) : (
        <>
          <Overview>
            <Arrow isPos={isPos}>{isPos ? '↑' : '↓'}</Arrow>
            <Amount>${parseFloat(result!.price?.toFixed(0)).toLocaleString()}</Amount>
            <Diff isPos={isPos}>
              {isPos ? '+' : null}
              {parseFloat(
                ((result!.percent_change_24h * result!.price) / 100).toFixed(0)
              ).toLocaleString()}{' '}
              ({isPos ? '+' : null}
              {result!.percent_change_24h.toFixed(1)}%)
            </Diff>
          </Overview>
          <Overview style={{ margin: '20px 0 10px 0' }}>
            <p
              style={{
                marginBottom: 15,
                fontSize: 20,
              }}
            >
              Prev. Close
            </p>
            <OverviewItem>
              <span>Volume</span>
              <span>{parseFloat(result!.volume_24h.toFixed(0)).toLocaleString()}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Highest Price</span>
              <span>{parseFloat(result!.ath_price.toFixed(0)).toLocaleString()}</span>
            </OverviewItem>
            <OverviewItem>
              <span>24-hour change</span> <span>{result?.market_cap_change_24h}%</span>
            </OverviewItem>
            <OverviewItem>
              <span>30-day change</span> <span>{result?.percent_change_30d}%</span>
            </OverviewItem>
          </Overview>
          <Overview style={{ marginBottom: 30 }}>
            <p
              style={{
                marginBottom: 15,
                fontSize: 20,
              }}
            >
              Open
            </p>
            <OverviewItem>
              <span>1-Day Vol. Change</span> <span>{result?.volume_24h_change_24h}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Highest Date</span> <span>{result?.ath_date.slice(0, 10)}</span>
            </OverviewItem>
            <OverviewItem>
              <span>7-day change</span> <span>{result?.percent_change_7d}%</span>
            </OverviewItem>
            <OverviewItem>
              <span>1-year change</span> <span>{result?.percent_change_1y}%</span>
            </OverviewItem>
          </Overview>
        </>
      )}
    </div>
  );
}
export default Price;
