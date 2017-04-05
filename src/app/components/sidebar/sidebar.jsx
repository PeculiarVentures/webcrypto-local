import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import SidebarHeader from './header';
import SidebarBody from './body';
import SidebarFooter from './footer';

const SidebarStyled = styled.div`
  display: inline-block;
  height: 100%;
  vertical-align: top;
  width: 320px;
  background: ${props => props.theme.sidebar.background};
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
    list: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    open: PropTypes.bool,
    dataLoaded: PropTypes.bool,
    serverStatus: PropTypes.string,
  };

  static defaultProps = {
    list: [],
    open: false,
    dataLoaded: false,
    serverStatus: 'seaching',
  };

  render() {
    const { list, open, dataLoaded, serverStatus, providers } = this.props;

    return (
      <SidebarStyled
        open={open}
      >
        <SidebarHeader
          dataLoaded={dataLoaded}
          providers={providers}
        />
        <SidebarBody
          list={list}
          dataLoaded={dataLoaded}
        />
        <SidebarFooter
          serverStatus={serverStatus}
        />
      </SidebarStyled>
    );
  }
}
