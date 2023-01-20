import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoins } from '../api';

const Container = styled.div`
  padding: 0px 20px;
  margin: 0 auto;
  max-width: 480px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const ConinList = styled.ul``;

const Coin = styled.li`
  margin: 0 0 20px;
  background: #fff;
  color: ${(props) => props.theme.bgColor};
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

const Loader = styled.span`
  display: block;
  text-align: center;
`;

const Img = styled.img`
  margin-right: 10px;
  width: 35px;
  height: 35px;
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

  return (
    <Container>
      <Header>
        <Title>코인</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <ConinList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}/chart`,
                  state: { name: coin.name },
                }}
              >
                <Img src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}></Img>
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </ConinList>
      )}
    </Container>
  );
}
export default Coins;
