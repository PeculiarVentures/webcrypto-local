import React, { PropTypes, Component } from 'react';
import Header from './header';
import Body from './body';
import { ModalActions } from '../../actions/ui';
import * as IndexStyled from '../certificate_create/styled/index.styled';

export default class CopyCertificate extends Component {

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  onBackHandler = () => {
    const { dispatch } = this.context;
    dispatch(ModalActions.closeModal());
  };

  render() {
    return (
      <IndexStyled.Wrapper>
        <Header
          onBack={this.onBackHandler}
        />
        <Body />
      </IndexStyled.Wrapper>
    );
  }
}
