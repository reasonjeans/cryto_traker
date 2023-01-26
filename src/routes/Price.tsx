import { useQuery } from 'react-query';
import styled from 'styled-components';
import { fetchCoinTickers } from '../api';
import { PriceData } from './Coin';

const Overview = styled.div`
  padding: 30px 20px;
  display: flex;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #fff;

  span:first-child {
    margin-right: 50px;
  }
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
  font-size: 20px;
  color: ${(props) => (props.isPos ? props.theme.greenColor : props.theme.redColor)};
`;

interface PriceProps {
  coinId: string;
}

function Price({ coinId }: PriceProps) {
  const { isLoading, data } = useQuery<PriceData>(
    ['chart', coinId],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 10000,
    }
  );

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
          <Overview style={{ justifyContent: 'space-between', marginTop: 20 }}>
            <div className="close">
              <p style={{ marginBottom: 10, borderBottom: '1px solid #fff' }}>Prev. Close</p>
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
            </div>
            <div className="open">
              <p style={{ marginBottom: 10, borderBottom: '1px solid #fff' }}>Open</p>
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
            </div>
          </Overview>
        </>
      )}
    </div>
  );
}
export default Price;
