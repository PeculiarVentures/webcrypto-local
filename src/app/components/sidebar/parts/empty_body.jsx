import React from 'react';
import styled from 'styled-components';
import { EmptyCertIcon } from '../../svg';
import enLang from '../../../langs/en.json';

const IconStyled = styled(EmptyCertIcon)`
  width: 74px;
`;

const TextStyled = styled.div`
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.03em;
  margin-top: 32px;
  color: ${props => props.theme.sidebar.colorEmpty};
  @media ${props => props.theme.media.mobile} {
    font-size: 15px;
    line-height: 20px;
    margin-top: 28px;
  }
`;

const ContainerStyled = styled.div`
  padding: 20px 50px;
  text-align: center;
  font-size: 0;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
`;

const EmptyBodyStyled = styled.div`
  height: 100%;
  ${props => props.theme.mixins.ghostVerticalAlign}
`;

const EmptyBody = () => (
  <EmptyBodyStyled>
    <ContainerStyled>
      <IconStyled />
      <TextStyled>
        { enLang['Sidebar.Body.Empty'] }
      </TextStyled>
    </ContainerStyled>
  </EmptyBodyStyled>
);

export default EmptyBody;
