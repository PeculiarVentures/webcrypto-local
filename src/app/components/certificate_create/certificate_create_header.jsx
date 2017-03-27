import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { Button } from '../basic';
import { ArrowBackIcon } from '../svg';
import enLang from '../../langs/en.json';

const Title = styled.div`
  line-height: 36px;
  color: ${props => props.theme.certificateCreate.colorHeader};
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.008em;
  width: 100%;
  max-width: 870px;
  margin: 0 auto;
  @media ${props => props.theme.media.mobile} {
    font-size: 18px;
    line-height: 56px;
    text-align: center;
  }
`;

const IconStyled = styled(ArrowBackIcon)`
  width: 12px;
`;

const Container = styled.div`
  border-bottom: 1px solid ${props => props.theme.certificateCreate.borderColorHeader};
  padding: 24px 0;
  position: relative;
  z-index: 1;
  @media ${props => props.theme.media.mobile} {
    padding: 0;
  }
`;

const ButtonStyled = styled(Button)`
  position: absolute;
  top: 24px;
  left: 0;
  @media ${props => props.theme.media.mobile} {
    display: none !important;
  }
`;

const CertificateCreateHeaderStyled = styled.div`
  height: 85px;
  padding: 0 30px;
  font-size: 0;
  @media ${props => props.theme.media.mobile} {
    height: 56px;
    padding: 0 10px;
  }
`;

const CertificateCreateHeader = (props) => {
  const { onBack } = props;

  const onClickhandler = () => {
    if (onBack) onBack();
  };

  return (
    <CertificateCreateHeaderStyled>
      <Container>
        <ButtonStyled
          onClick={onClickhandler}
        >
          <IconStyled />
          { enLang['CertificateCreate.Header.Btn.Back'] }
        </ButtonStyled>
        <Title>
          { enLang['CertificateCreate.Header.Title'] }
        </Title>
      </Container>
    </CertificateCreateHeaderStyled>
  );
};

CertificateCreateHeader.propTypes = {
  onBack: PropTypes.func,
};

export default CertificateCreateHeader;
