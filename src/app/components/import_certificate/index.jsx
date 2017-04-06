import React, { PropTypes, Component } from 'react';
import Header from './header';
import Body from './body';
import { ModalActions } from '../../actions/ui';
import * as IndexStyled from '../create_certificate/styled/index.styled';

export default class ImportCertificate extends Component {

  static propTypes = {
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    providers: [],
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  onBackHandler = () => {
    const { dispatch } = this.context;
    dispatch(ModalActions.closeModal());
  };

  render() {
    const { providers } = this.props;
    return (
      <IndexStyled.Wrapper>
        <Header
          onBack={this.onBackHandler}
        />
        <Body
          providers={providers}
        />
      </IndexStyled.Wrapper>
    );
  }
}
