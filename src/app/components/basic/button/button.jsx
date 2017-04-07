import React, { PropTypes, Component } from 'react';
import { ButtonStyled } from './styled/button.styled';

export default class Button extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    href: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    primary: false,
    secondary: false,
    disabled: false,
    href: '',
  };

  render() {
    const { children } = this.props;
    // const ButtonStyled = styled[href && !disabled ? 'a' : 'button']`
    //   ${props => readyStyles(props)}
    // `;

    return (
      <ButtonStyled
        tabIndex={0}
        {...this.props}
      >
        { children }
      </ButtonStyled>
    );
  }
}
