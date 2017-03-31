import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import SidebarHeader from './sidebar_header';
import SidebarBody from './sidebar_body';
import SidebarFooter from './sidebar_footer';

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
    serverIsOnline: PropTypes.bool,
  };

  static defaultProps = {
    list: [],
    open: false,
    dataLoaded: false,
    serverIsOnline: false,
  };

  render() {
    const { list, open, dataLoaded, serverIsOnline } = this.props;

    return (
      <SidebarStyled
        open={open}
      >
        <SidebarHeader
          dataLoaded={dataLoaded}
        />
        <SidebarBody
          list={list}
          dataLoaded={dataLoaded}
        />
        <SidebarFooter
          serverIsOnline={serverIsOnline}
        />
      </SidebarStyled>
    );
  }
}
