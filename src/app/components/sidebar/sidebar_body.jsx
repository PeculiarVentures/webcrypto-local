import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import Certificate from './parts/certificate';
import EmptyBody from '../info/empty_body';
import Shell from './parts/shell';

const SidebarBodyStyled = styled.div`
  height: calc(100% - 84px - 44px);
  overflow: auto;
  @media ${props => props.theme.media.mobile} {
    height: calc(100% - 56px - 34px);
  }
`;

export default class SidebarBody extends Component {

  static propTypes = {
    list: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    dataLoaded: PropTypes.bool,
  };

  static defaultProps = {
    list: [],
    dataLoaded: false,
  };

  static contextTypes = {
    windowSize: PropTypes.object,
  };

  getEmptyBody() {
    const { windowSize } = this.context;

    if (windowSize.device === 'mobile') {
      return (
        <EmptyBody blackBg />
      );
    }
    return null;
  }

  renderCertificates() {
    const { list } = this.props;

    return list.map((item, index) => (
      <Certificate
        key={index}
        id={item.id}
        name={item.name}
        type={item.type}
        selected={item.selected}
        algorithm={item.algorithm || item.keyInfo.algorithm}
        startDate={item.startDate || item.createdAt}
      />
    ));
  }

  renderContent() {
    const { list, dataLoaded } = this.props;

    switch (true) {
      case !dataLoaded:
        return (
          <Shell />
        );

      case !list.length:
        return (
          this.getEmptyBody()
        );

      case list.length > 0:
        return (
          this.renderCertificates()
        );

      default:
        return null;
    }
  }

  render() {
    return (
      <SidebarBodyStyled>
        { this.renderContent() }
      </SidebarBodyStyled>
    );
  }
}
