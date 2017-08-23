import styled from 'styled-components';
import { Button } from '../../basic';

export const BtnsContainer = styled.div`
  text-align: center;
  font-size: 0;
  margin-top: 55px;
  @media ${props => props.theme.media.mobile} {
    margin-top: 26px;
  }
`;

export const Btn = styled(Button)`
  margin-left: 10px;
  @media ${props => props.theme.media.mobile} {
    margin-left: 8px;
  }
`;

export const Container = styled.div`
  max-width: 800px;
  padding: 0 10px;
  margin: 0 auto;
  @media ${props => props.theme.media.mobile} {
    padding: 0 20px;
  }
`;

export const Body = styled.div`
  height: calc(100% - 76px);
  overflow: auto;
  padding: 80px 0;
  @media ${props => props.theme.media.mobile} {
    height: calc(100% - 56px);
    padding: 36px 0;
  }
`;