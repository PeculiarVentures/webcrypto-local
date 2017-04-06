import React, { PropTypes } from 'react';
import enLang from '../../langs/en.json';
import * as HeaderStyled from './styled/header.styled';

const Header = (props) => {
  const { onBack } = props;

  const onClickhandler = () => {
    if (onBack) onBack();
  };

  return (
    <HeaderStyled.Header>
      <HeaderStyled.Container>
        <HeaderStyled.Btn
          onClick={onClickhandler}
        >
          <HeaderStyled.IconStyled />
          { enLang['CertificateCreate.Header.Btn.Back'] }
        </HeaderStyled.Btn>
        <HeaderStyled.Title>
          { enLang['CertificateCreate.Header.Title'] }
        </HeaderStyled.Title>
      </HeaderStyled.Container>
    </HeaderStyled.Header>
  );
};

Header.propTypes = {
  onBack: PropTypes.func,
};

export default Header;
