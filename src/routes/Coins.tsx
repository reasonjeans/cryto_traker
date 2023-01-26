import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { fetchCoins } from '../api';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../atoms';

import styled from 'styled-components';

const Container = styled.div`
  padding: 0px 20px;
  margin: 0 auto;
  max-width: 540px;
`;

const Header = styled.header`
  position: relative;
  height: 10vh;
  line-height: 10vh;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const ConinList = styled.ul``;

const Coin = styled.li`
  margin: 0 0 20px;
  background: ${(props) => props.theme.boxColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;

  a {
    padding: 20px;
    display: flex;
    align-items: center;
    transition: color 0.2s ease-in;
  }

  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Symbol = styled.span`
  margin-left: 10px;
  font-size: 10px;
  color: #f00;
`;

const Loader = styled.span`
  display: block;
  text-align: center;
`;

const Img = styled.img`
  margin-right: 10px;
  width: 35px;
  height: 35px;
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

  div {
    font-size: 20px;
    line-height: 20px;
    transition: all 0.3s linear;

    &:first-child {
      transform: ${(props) => (props.isDark ? 'translateY(100px)' : `translateY(0px)`)};
    }

    &:last-child {
      transform: ${(props) => (!props.isDark ? 'translateY(100px)' : `translateY(0px)`)};
    }
  }
`;

interface ICoins {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  /* react-query 사용 전
  const [coins, setCoins] = useState<ICoins[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await fetch('https://api.coinpaprika.com/v1/coins');
      const json = await response.json();

      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []); */

  //* react-query 사용 후
  const { isLoading, data } = useQuery<ICoins[]>('allCoins', fetchCoins);
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  return (
    <Container>
      <Header>
        <Title>Crypto</Title>
        <ThemeToggle isDark={isDark} onClick={toggleDarkAtom}>
          <div className="moon">🌜</div>
          <div className="sun">🌞</div>
        </ThemeToggle>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <ConinList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}/price`,
                  state: { name: coin.name },
                }}
              >
                <Img src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}></Img>
                {coin.name}
                <Symbol>{coin.symbol}</Symbol>
              </Link>
            </Coin>
          ))}
        </ConinList>
      )}
    </Container>
  );
}
export default Coins;
