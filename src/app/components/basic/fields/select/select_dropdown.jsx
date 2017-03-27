import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { QShortcuts } from '../../../../controllers';

const DropdownStyled = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  width: 100%;
  border-radius: ${props => props.theme.borderRadius}px;
  background: ${props => props.theme.field.select.backgroundDropdown};
  border: 1px solid ${props => props.theme.field.select.borderColorDropdown};
  max-height: 200px;
  overflow: auto;
  z-index: 1;
`;

export default class SelectDropdown extends Component {

  static propTypes = {
    children: PropTypes.node,
    onChange: PropTypes.func,
    selectedItemData: PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      index: PropTypes.number,
    }),
  };

  constructor(props) {
    super();

    this.state = {
      focusCounter: props.selectedItemData.index,
    };

    this.unbind = () => {};
  }

  componentDidMount() {
    QShortcuts.on('DOWN', this.onDownHandler);
    QShortcuts.on('UP', this.onUpHandler);
    QShortcuts.on('ENTER', this.onEnterHandler);

    this.unbind = () => {
      QShortcuts.off('DOWN', this.onDownHandler);
      QShortcuts.off('UP', this.onUpHandler);
      QShortcuts.off('ENTER', this.onEnterHandler);
    };
  }

  componentWillUnmount() {
    this.unbind();
  }

  onDownHandler = () => {
    const { children } = this.props;
    const { focusCounter } = this.state;
    const childrenLength = children.length;
    let counter = focusCounter;

    if (focusCounter < childrenLength - 1) {
      counter += 1;
    } else {
      counter = childrenLength - 1;
    }

    this.setState({
      focusCounter: counter,
    });
  };

  onUpHandler = () => {
    const { focusCounter } = this.state;
    let counter = focusCounter;

    if (focusCounter > 0) {
      counter -= 1;
    } else {
      counter = 0;
    }

    this.setState({
      focusCounter: counter,
    });
  };

  onEnterHandler = () => {
    const { children } = this.props;
    const { focusCounter } = this.state;
    const childProps = children[focusCounter].props;

    this.onClickChildHandler(focusCounter, childProps.value, childProps.primaryText, true);
  };

  onClickChildHandler = (index, value, name, close) => {
    const { onChange } = this.props;
    onChange({
      index,
      value,
      name,
    }, close);
  };

  render() {
    const { children, selectedItemData } = this.props;
    const { focusCounter } = this.state;

    const decoratedChildren = React.Children.map(children, (child, index) => {
      const extraProps = {
        index,
        onClick: this.onClickChildHandler,
        selected: selectedItemData.value === child.props.value,
        focus: focusCounter === index,
      };
      return React.cloneElement(child, extraProps);
    });

    return (
      <DropdownStyled>
        { decoratedChildren }
      </DropdownStyled>
    );
  }
}
