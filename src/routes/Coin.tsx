import React from 'react';
import { useQuery } from 'react-query';
import { Link, Route, Switch, useLocation, useParams, useRouteMatch } from 'react-router-dom';

import { fetchCoinInfo, fetchCoinTickers } from '../api';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../atoms';

import Chart from './Chart';
import Price from './Price';

import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  padding: 0px 20px;
  margin: 0 auto;
  max-width: 540px;
`;

const Header = styled.header`
  position: relative;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  display: block;
  text-align: center;
`;

const Overview = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  background: ${(props) => props.theme.boxColor};
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    margin-bottom: 5px;
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  margin: 25px 0;
  display: flex;
  border-bottom: 1px solid;
  border-color: ${(props) => props.theme.textColor};

  div:first-child {
    margin-right: 20px;
  }
`;

const Tab = styled.div<{ isActive: boolean }>`
  padding: 10px 0;
  color: ${(props) => (props.isActive ? props.theme.accentColor : props.theme.textColor)};
  border-bottom: 3px solid ${(props) => (props.isActive ? props.theme.accentColor : 'transparent')};
  text-align: center;

  a {
    display: block;
  }
`;

const BackButton = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 100%;
  font-size: 30px;
  text-align: center;
  line-height: 2;
  z-index: 1;
`;

const ThemeToggle = styled.button<{ isDark: boolean }>`
  padding: 5px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  width: 60px;
  height: 30px;
  background: ${({ theme }) => theme.gradient};
  border: none;
  border-radius: 30px;
  cursor: pointer;
  overflow: hidden;

  span {
    font-size: 20px;
    line-height: 22px;
    transition: all 0.3s linear;

    &:first-child {
      transform: ${(props) => (props.isDark ? 'translateY(100px)' : `translateY(0px)`)};
    }

    &:last-child {
      transform: ${(props) => (!props.isDark ? 'translateY(100px)' : `translateY(0px)`)};
    }
  }
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
}

interface ITags {
  coin_counter: number;
  ico_counter: number;
  id: string;
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  tags: ITags[];
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

export interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch('/:coinId/price');
  const chartMatch = useRouteMatch('/:coinId/chart');

  /* react-query 사용 전
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<InfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceData>();
  
  useEffect(() => {
    (async () => {
      const infoData = await (await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)).json();
      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();

      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, [coinId]); */

  //* react-query 사용 후
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(['info', coinId], () =>
    fetchCoinInfo(coinId)
  );
  const { isLoading: tikersLoading, data: tikersData } = useQuery<PriceData>(
    ['tikers', coinId],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 5000,
    }
  );
  const loading = infoLoading || tikersLoading;

  return (
    <Container>
      <Link to={'/'}>
        <BackButton>&larr;</BackButton>
      </Link>
      <Header>
        <Title>{state?.name ? state.name : loading ? 'Loading..' : infoData?.name}</Title>
        <ThemeToggle isDark={isDark} onClick={toggleDarkAtom}>
          <span className="moon">🌜</span>
          <span className="sun">🌞</span>
        </ThemeToggle>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Open Source:</span>
              <span>{tikersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply</span>
              <span>{tikersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply</span>
              <span>{tikersData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>PRICE</Link>
            </Tab>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>CHART</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/:coinId/price`}>
              <Price coinId={coinId} tikersData={tikersData} />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}
export default Coin;
