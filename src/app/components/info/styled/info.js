import styled from 'styled-components';

export const Root = styled.div`
  width: 100%;
  padding: 70px 19% 60px;
  @media ${props => props.theme.media.mobile} {
    padding: 36px 20px;
  }
`;

export const Row = styled.div`
  padding: 52px 10px;
  border-bottom: 1px solid ${props => props.theme.info.infoTable.rowBorderColor};
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
    border: none;
  }
  @media ${props => props.theme.media.mobile} {
    padding: 30px 6px;
  }
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.036em;
  color: ${props => props.theme.info.infoTable.mainTitleColor};
  @media ${props => props.theme.media.mobile} {
    font-size: 15px;
    line-height: 21px;
  }
`;

export const Col = styled.div`
  display: inline-block;
  width: calc(100% / 3);
  vertical-align: top;
  padding: 0 5px;
  margin-top: 27px;
  &:nth-child(-n+4) {
    margin-top: 32px;
  }
  &:nth-child(3n+2) {
    padding-left: 0;
  }
  &:nth-child(3n+4) {
    padding-right: 0;
  }
  @media ${props => props.theme.media.mobile} {
    width: calc(100% / 2);
    margin-top: 18px;
    &:nth-child(2n) {
      padding-right: 0;
    }
    &:nth-child(3n) {
      padding-right: 5px;
      padding-left: 0;
    }
  }
`;

export const SubTitle = styled.div`
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${props => props.theme.info.infoTable.subTitleColor};
`;

export const Value = styled.div`
  margin-top: 4px;
  font-size: 14px;
  letter-spacing: 0.05em;
  color: ${props => props.theme.info.infoTable.valueColor};
`;
