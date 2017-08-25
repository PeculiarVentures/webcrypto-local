import styled from 'styled-components';
import { ArrowBackIcon } from '../../svg';
import { Button } from '../../basic';

export const Title = styled.div`
  line-height: 32px;
  color: ${props => props.theme.info.header.titleColor};
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.019em;
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  text-align: center;
  @media ${props => props.theme.media.mobile} {
    font-size: 13px;
    line-height: 56px;
    ${props => props.theme.mixins.truncateText}
    width: calc(100% - 110px);
  }
`;

export const IconStyled = styled(ArrowBackIcon)`
  width: 12px;
`;

export const Container = styled.div`
  border-bottom: 1px solid ${props => props.theme.certificateCreate.borderColorHeader};
  padding: 21px 0;
  position: relative;
  z-index: 1;
  @media ${props => props.theme.media.mobile} {
    padding: 0;
  }
`;

export const Btn = styled(Button)`
  position: absolute;
  top: 21px;
  left: 10px;
  @media ${props => props.theme.media.mobile} {
    top: 12px;
    font-size: 0;
    padding: 0 13px;
    svg {
        margin-right: 0;
    }
  }
`;

export const Header = styled.div`
  height: 76px;
  padding: 0 30px;
  font-size: 0;
  @media ${props => props.theme.media.mobile} {
    height: 56px;
    padding: 0 10px;
  }
`;
