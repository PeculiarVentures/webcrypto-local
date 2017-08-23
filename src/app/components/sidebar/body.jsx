import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import Item from './parts/item';
import EmptyBody from '../info/empty_body';
import Shell from './parts/shell';

const SidebarBodyStyled = styled.div`
  height: calc(100% - 279px - 73px);
  overflow: auto;
  @media ${props => props.theme.media.mobile} {
    height: calc(100% - 122px - 34px);
  }
`;

export default class SidebarBody extends Component {

  static propTypes = {
    list: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    loaded: PropTypes.bool,
  };

  static defaultProps = {
    list: [],
    loaded: false,
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

  renderItems() {
    const { list } = this.props;

    return list.map((item, index) => (
      <Item
        key={index}
        id={item.id}
        name={item.name}
        type={item.type}
        selected={item.selected}
        algorithm={item.algorithm || item.publicKey.algorithm}
        size={item.modulusLength || item.namedCurve || item.publicKey.modulusBits || item.publicKey.namedCurve || ''}
      />
    ));
  }

  renderContent() {
    const { list, loaded } = this.props;

    switch (true) {
      case !loaded:
        return (
          <Shell />
        );

      case list.length > 0:
        return (
          this.renderItems()
        );

      default:
        return (
          this.getEmptyBody()
        );
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
