import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import SidebarHeader from './header';
import SidebarBody from './body';
import SidebarFooter from './footer';

const SidebarStyled = styled.div`
  display: inline-block;
  height: 100%;
  vertical-align: top;
  width: 360px;
  background: ${props => props.theme.sidebar.background};
  box-shadow: 10px 0 20px 0 rgba(112,125,134,0.05);
  position: relative;
  @media ${props => props.theme.media.mobile} {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    transition: transform 300ms ease-out;
    transform: translate3d(${props => (
      props.open
        ? 0
        : '-100vw'
    )}, 0, 0);
  }
`;

export default class Sidebar extends Component {

  static propTypes = {
    open: PropTypes.bool,
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
    open: false,
    loaded: false,
    status: 'seaching',
    providers: [],
    provider: {},
  };

  render() {
    const { open, loaded, status, providers, provider } = this.props;

    return (
      <SidebarStyled
        open={open}
      >
        <SidebarHeader
          loaded={loaded}
          providers={providers}
          readOnly={provider.readOnly}
        />
        <SidebarBody
          list={provider.items}
          loaded={loaded}
        />
        <SidebarFooter
          status={status}
        />
      </SidebarStyled>
    );
  }
}
