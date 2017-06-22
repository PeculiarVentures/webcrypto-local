import React, { PropTypes } from 'react';
import { ButtonStyled } from './styled/button.styled';

const Button = props => (
  <ButtonStyled
    tabIndex={0}
    {...props}
  >
    { props.children }
  </ButtonStyled>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  href: PropTypes.string,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  primary: false,
  secondary: false,
  disabled: false,
};

export default Button;
