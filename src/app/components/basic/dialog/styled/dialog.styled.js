import styled from 'styled-components';
import { Button } from '../../button';

export const Btn = styled(Button)`
  margin-left: 10px;
  &:first-child {
    margin-left: 0;
  }
  @media ${props => props.theme.media.mobile} {
    margin-left: 8px;
  }
`;

export const BtnsContainer = styled.div`
  margin-top: 36px;
  @media ${props => props.theme.media.mobile} {
    margin-top: 32px;
  }
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.036em;
  color: ${props => props.theme.dialog.color};
  line-height: 24px;
  white-space: pre-line;
  @media ${props => props.theme.media.mobile} {
    font-size: 15px;
    line-height: 21px;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${props => props.theme.dialog.background};
  border: 1px solid ${props => props.theme.dialog.borderColor};
  border-radius: ${props => props.theme.borderRadius}px;
  display: inline-block;
  padding: 88px 70px 86px;
  vertical-align: middle;
  @media ${props => props.theme.media.mobile} {
    width: calc(100% - 20px);
    padding: 50px 30px 46px;
  }
`;

export const Dialog = styled.div`
  width: 100%;
  text-align: center;
  height: 100%;
  z-index: 10;
  padding: 30px 0;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
  background: ${props => props.theme.dialog.backgroundOverlay};
  animation: ${props => props.theme.mixins.fadeIn} ${props => props.theme.basicTransition}ms;
  ${props => props.theme.mixins.ghostVerticalAlign}
`;
