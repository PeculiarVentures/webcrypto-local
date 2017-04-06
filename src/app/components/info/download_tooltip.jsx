import React, { PropTypes, Component } from 'react';
import { ItemStyled, WrapperStyled, ContainerStyled } from './styled/download_tooltip.styled';
import enLang from '../../langs/en.json';

export default class DownloadTooltip extends Component {

  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    disabled: true,
    onClick: null,
  };

  render() {
    const { disabled, onClick } = this.props;

    return (
      <WrapperStyled disabled={disabled}>
        <ContainerStyled>
          <ItemStyled onClick={() => onClick('pem')}>
            { enLang['Info.Header.Download.Pem'] }
          </ItemStyled>
          <ItemStyled onClick={() => onClick('raw')}>
            { enLang['Info.Header.Download.Der'] }
          </ItemStyled>
        </ContainerStyled>
      </WrapperStyled>
    );
  }
}
