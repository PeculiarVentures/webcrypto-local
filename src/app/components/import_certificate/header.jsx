import React, { PropTypes } from 'react';
import enLang from '../../langs/en.json';
import * as HeaderStyled from '../create_certificate/styled/header.styled';

const Header = (props) => {
  const { onBack } = props;

  const onClickhandler = () => {
    if (onBack) onBack();
  };

  return (
    <HeaderStyled.Header>
      <HeaderStyled.Container>
        <HeaderStyled.Btn
          showOnMobile
          onClick={onClickhandler}
        >
          <HeaderStyled.IconStyled />
          { enLang['CertificateCreate.Header.Btn.Back'] }
        </HeaderStyled.Btn>
        <HeaderStyled.Title>
          { enLang['ImportCertificate.Header.Title'] }
        </HeaderStyled.Title>
      </HeaderStyled.Container>
    </HeaderStyled.Header>
  );
};

Header.propTypes = {
  onBack: PropTypes.func,
};

Header.defaultProps = {
  onBack: null,
};

export default Header;
