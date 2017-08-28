import React, { PropTypes, Component } from 'react';
import uuid from 'uuid';
import styled from 'styled-components';
import { CheckmarkIcon } from '../../svg';

const TextStyles = styled.span`
  ${(props) => {
    const transition = `${props.theme.basicTransition}ms`;
    let color = props.theme.checkbox.color;

    if (props.disabled) {
      color = props.theme.checkbox.colorDisabled;
    }

    return `
      display: inline-block;
      vertical-align: top;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.075em;
      color: ${color};
      margin-left: 6px;
      cursor: ${props.disabled ? 'default' : 'pointer'};
      transition: color ${transition};
      max-width: calc(100% - 16px - 6px);
    `;
  }}
`;

const IconStyled = styled(CheckmarkIcon)`
  transition: fill ${props => props.theme.basicTransition}ms;
  position: absolute;
  display: block;
  width: 9px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  fill: ${props => (
    props.disabled
      ? props.theme.checkbox.colorDisabled
      : props.theme.checkbox.iconColor
  )}
`;

const BoxStyled = styled.div`
  ${(props) => {
    const transition = `${props.theme.basicTransition}ms`;
    let borderColor = props.theme.checkbox.borderColor;

    if (props.disabled) {
      borderColor = props.theme.checkbox.borderColorDisabled;
    }

    return `
      transition: border-color ${transition};
      position: relative;
      width: 16px;
      height: 16px;
      border: 1px solid ${borderColor};
      border-radius: ${props.theme.borderRadius}px;
      display: inline-block;
      vertical-align: top;
      cursor: ${props.disabled ? 'default' : 'pointer'};
    `;
  }}
`;

const CheckboxStyled = styled.div`
  font-size: 0;
  &:focus label>div {
    border-color: ${props => props.theme.checkbox.borderColorActive};
  }
`;

export default class Checkbox extends Component {

  static propTypes = {
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    onCheck: PropTypes.func,
    labelText: PropTypes.string,
    name: PropTypes.string,
  };

  static defaultProps = {
    defaultChecked: false,
    disabled: false,
    onCheck: null,
    labelText: '',
    name: '',
  };

  constructor() {
    super();

    this.state = {
      switched: false,
    };

    this.checkboxId = uuid();
  }

  componentWillMount() {
    const { checked, defaultChecked } = this.props;

    if (checked || defaultChecked) {
      this.setState({
        switched: true,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.checked !== nextProps.checked) {
      this.setState({
        switched: nextProps.checked,
      });
    }
  }

  onChangeHandler = () => {
    const { onCheck, name } = this.props;
    const switched = this.state.switched;

    if (onCheck) onCheck(!switched, name);
    if (!{}.hasOwnProperty.call(this.props, 'checked')) {
      this.setState({
        switched: !switched,
      });
    }
  };

  onKeyUpHandler = (e) => {
    const keyCode = e.keyCode;
    if (keyCode === 13) {
      this.onChangeHandler();
    }
  };

  getValue = () => (
    this.state.switched
  );

  render() {
    const { disabled, labelText } = this.props;
    const { switched } = this.state;
    const checkboxContainerProps = {};

    if (!disabled) {
      Object.assign(checkboxContainerProps, {
        tabIndex: 0,
        onKeyUp: this.onKeyUpHandler,
      });
    }

    return (
      <CheckboxStyled {...checkboxContainerProps}>
        <label
          htmlFor={this.checkboxId}
        >
          <BoxStyled
            disabled={disabled}
          >
            {
              switched
              ? <IconStyled
                disabled={disabled}
              />
              : null
            }
          </BoxStyled>
          {
            labelText
            ? <TextStyles
              disabled={disabled}
            >
              { labelText }
            </TextStyles>
            : null
          }
        </label>
        <input
          style={{ display: 'none' }}
          id={this.checkboxId}
          type="checkbox"
          onChange={this.onChangeHandler}
          disabled={disabled}
        />
      </CheckboxStyled>
    );
  }
}
