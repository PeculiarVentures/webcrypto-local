import styled from 'styled-components';

export const Title = styled.div`
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: 0.09em;
  color: #40484F;
  text-transform: uppercase;
  @media ${props => props.theme.media.mobile} {
    font-size: 15px;
    line-height: 21px;
  }
`;

export const GroupContainer = styled.div`
  margin-top: 30px;
  padding: 0 20px 30px;
  border-bottom: 1px solid rgba(214, 219, 222, .3);
  &:first-child {
    margin-top: 0;
  }
  @media ${props => props.theme.media.mobile} {
    margin-top: 30px;
    padding: 0 6px 30px 6px;
  }
`;

export const GroupPart = styled.div`
  font-size: 0;
  margin-top: 29px;
  @media ${props => props.theme.media.mobile} {
    margin-top: 15px;
    &:nth-child(2) {
      margin-top: 20px;
    }
  }
`;
