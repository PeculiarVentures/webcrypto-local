import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';

const SelectItemStyled = styled.div`
  color: ${props => (
    props.selected
    ? props.theme.field.select.colorDropdownItemSelected
    : props.theme.field.select.colorDropdownItem
  )};
  padding: 6px 10px;
  font-size: 13px;
  line-height: 14px;
  letter-spacing: 0.075em;
  cursor: ${props => (
    props.selected
      ? 'default'
      : 'pointer'
  )};
  transition: opacity ${props => props.theme.basicTransition}ms, color ${props => props.theme.basicTransition}ms;
  position: relative;
  opacity: ${props => (
    props.focus
    ? 0.6
    : 1
  )};
  &:after {
    height: 1px;
    width: calc(100% - 12px);
    position: absolute;
    bottom: 0;
    left: 4px;
    content: '';
    background: ${props => props.theme.field.select.borderColorDropdownItem};
  }
  &:hover,
  &:focus {
    opacity: .6;
  }
  &:last-child:after {
    display: none;
  }
`;

export default class SelectItem extends Component {

  static propTypes = {
    primaryText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    selected: PropTypes.bool,
    // TODO: add disabled variant
    // disabled: PropTypes.bool,
    onClick: PropTypes.func,
    index: PropTypes.number,
    focus: PropTypes.bool,
  };

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.selected !== this.props.selected ||
      nextProps.focus !== this.props.focus
    );
  }

  onClickHandler = () => {
    const { index, value, primaryText, onClick, selected } = this.props;
    if (!selected) {
      onClick(index, value, primaryText);
    }
  };

  render() {
    const { primaryText, selected, focus } = this.props;

    return (
      <SelectItemStyled
        onClick={this.onClickHandler}
        selected={selected}
        focus={focus}
      >
        { primaryText }
      </SelectItemStyled>
    );
  }
}
