import styled from 'styled-components';

export const Title = styled.div`
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
  letter-spacing: 0.036em;
  color: ${props => props.theme.certificateCreate.colorBodyTitle};
  @media ${props => props.theme.media.mobile} {
    font-size: 15px;
    line-height: 21px;
  }
`;

export const GroupContainer = styled.div`
  margin-top: 54px;
  padding: 0 5px 54px 5px;
  border-bottom: 1px solid ${props => props.theme.certificateCreate.borderColorBodyGroup};;
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
  margin-top: 28px;
  &:nth-child(2) {
    margin-top: 33px;
  }
  @media ${props => props.theme.media.mobile} {
    margin-top: 15px;
    &:nth-child(2) {
      margin-top: 20px;
    }
  }
`;
