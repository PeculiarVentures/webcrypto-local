import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import enLang from '../../langs/en.json';

const SidebarFooterStyled = styled.div`
  border-top: 1px solid ${props => props.theme.sidebar.borderColorFooter};
  padding: 13px 30px;
  height: 44px;
  @media ${props => props.theme.media.mobile} {
    height: 34px;
    padding: 8px 12px;
  }
`;

const StatusIconStyled = styled.div`
  width: 7px;
  height: 7px;
  display: inline-block;
  vertical-align: top;
  border-radius: 50%;
  background: ${(props) => {
    const status = props.status;
    if (status === 'seaching') {
      return props.theme.sidebar.iconStatusSeaching;
    } else if (status === 'online') {
      return props.theme.sidebar.iconStatusOnline;
    } else if (status === 'offline') {
      return props.theme.sidebar.iconStatusOffline;
    }
    return '';
  }};
  margin-right: 9px;
  margin-top: 5px;
  transition: background ${props => props.theme.basicTransition}ms;
`;

const StatusTextStyled = styled.div`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.02em;
  display: inline-block;
  vertical-align: top;
  color: ${props => props.theme.sidebar.colorFooter};
  @media ${props => props.theme.media.mobile} {
    font-size: 11px;
  }
`;

export default class SidebarFooter extends Component {

  static propTypes = {
    status: PropTypes.string,
  };

  static defaultProps = {
    status: 'seaching',
  };

  getStatusText() {
    const { status } = this.props;

    switch (status) {
      case 'seaching':
        return enLang['Sidebar.Footer.Status.Seaching'];

      case 'online':
        return enLang['Sidebar.Footer.Status.Online'];

      case 'offline':
        return enLang['Sidebar.Footer.Status.Offline'];

      default:
        return null;
    }
  }

  render() {
    const { status } = this.props;

    return (
      <SidebarFooterStyled>
        <StatusIconStyled
          status={status}
        />
        <StatusTextStyled>
          { this.getStatusText() }
        </StatusTextStyled>
      </SidebarFooterStyled>
    );
  }
}
