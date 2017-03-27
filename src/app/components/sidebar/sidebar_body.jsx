import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import Certificate from './parts/certificate';
import EmptyBody from '../info/empty_body';

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
  };

  static defaultProps = {
    list: [],
  };

  renderCertificates() {
    const { list } = this.props;

    return list.map((item, index) => (
      <Certificate
        key={index}
        {...item}
      />
    ));
  }

  render() {
    const { list } = this.props;

    return (
      <SidebarBodyStyled>
        {
          !list.length
            ? <EmptyBody blackBg />
            : this.renderCertificates()
        }
      </SidebarBodyStyled>
    );
  }
}
