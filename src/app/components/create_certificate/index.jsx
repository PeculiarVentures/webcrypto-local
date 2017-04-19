import React, { PropTypes, Component } from 'react';
import Header from './header';
import Body from './body';
import { WSActions, AppActions } from '../../actions/state';
import * as IndexStyled from './styled/index.styled';

export default class CertificateCreate extends Component {

  static propTypes = {
    loaded: PropTypes.bool,
    status: PropTypes.string,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    provider: PropTypes.oneOfType([
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    loaded: false,
    status: 'seaching',
    providers: [],
    provider: {},
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  onCancelHandler = () => {
    const { dispatch } = this.context;
    dispatch(AppActions.create(false));
  };

  onCreateHandler = (data) => {
    const { dispatch } = this.context;
    dispatch(WSActions.createRequest(data));
  };

  render() {
    const { loaded, status, providers, provider } = this.props;
    return (
      <IndexStyled.Wrapper>
        <Header
          onBack={this.onCancelHandler}
        />
        <Body
          onCancel={this.onCancelHandler}
          onCreate={this.onCreateHandler}
          loaded={loaded}
          status={status}
          providers={providers}
          readOnly={provider.readOnly}
        />
      </IndexStyled.Wrapper>
    );
  }
}
