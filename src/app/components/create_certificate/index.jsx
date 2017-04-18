import React, { PropTypes, Component } from 'react';
import Header from './header';
import Body from './body';
import { WSActions } from '../../actions/state';
import { RoutingActions } from '../../actions/ui';
import * as IndexStyled from './styled/index.styled';

export default class CertificateCreate extends Component {

  static propTypes = {
    loaded: PropTypes.bool,
    status: PropTypes.string,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    loaded: false,
    status: 'seaching',
    providers: [],
    readOnly: false,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  onCancelHandler = () => {
    const { dispatch } = this.context;
    dispatch(RoutingActions.back());
  };

  onCreateHandler = (data) => {
    const { dispatch } = this.context;
    dispatch(WSActions.createCertificate(data));
  };

  render() {
    const { loaded, status, providers, readOnly } = this.props;
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
          readOnly={readOnly}
        />
      </IndexStyled.Wrapper>
    );
  }
}
