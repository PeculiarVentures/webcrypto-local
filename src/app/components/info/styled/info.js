import styled from 'styled-components';

export const Root = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 86px 10px;
  margin: 0 auto;
  @media ${props => props.theme.media.mobile} {
    padding: 36px 20px;
  }
`;

export const Row = styled.div`
  padding: 30px 20px;
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

export const RowCert = styled.div`
  margin-top: 23px;
`;

export const RowCertInfo = styled.div`
  margin-top: 7px;
  font-size: 0;
  @media ${props => props.theme.media.mobile} {
    margin-top: 10px;
  }
`;

export const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 18px;
  color: rgba(64, 79, 72, .2);
  @media ${props => props.theme.media.mobile} {
    font-size: 15px;
    line-height: 21px;
  }
`;

export const ColCert = styled.div`
  ${props => (
    props.monospace
      ? 'font-family: Monaco, monospace !important;'
      : 'font-family: inherit;'
  )};
  font-size: 12px;
  letter-spacing: 0.04em;
  display: inline-block;
  vertical-align: top;
  line-height: 15px;
  color: #59656E;
  -webkit-user-select: auto;
  -moz-user-select: auto;
  -ms-user-select: auto;
  user-select: auto;
  &:first-child {
    color: rgba(112, 125, 124, .62);
    width: 25%;
    padding-right: 10px;
    font-size: 12px;
  }
  &:nth-child(2) {
    width: 75%;
  }
  @media ${props => props.theme.media.mobile} {
    width: 100% !important;
    &:nth-child(2) {
      margin-top: 2px;
    }
  }
`;
