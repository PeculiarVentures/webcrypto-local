import React, { PropTypes, Component } from 'react';
import uuid from 'uuid';
import styled from 'styled-components';
import { validator } from '../../../helpers';

const FieldLabelStyled = styled.label`
  font-size: 12px;
  line-height: 16px;
  display: block;
  width: 100%;
  letter-spacing: 0.04em;
  color: ${props => props.theme.field.text.labelColor};
  margin-bottom: 4px;
`;

const fieldReadyStyles = (props) => {
  const transition = `${props.theme.basicTransition}ms`;
  const multiline = props.multiline;
  let placeholderColor = props.theme.field.text.placeholderColor;
  let color = props.theme.field.text.color;
  let borderColor = props.theme.field.text.borderColor;
  let borderColorActive = props.theme.field.text.borderColorActive;

  if (!props.valid) {
    borderColor = props.theme.field.text.borderColorInvalid;
    borderColorActive = borderColor;
  }

  if (props.disabled) {
    placeholderColor = props.theme.field.text.placeholderColorDisabled;
    color = props.theme.field.text.colorDisabled;
    borderColor = props.theme.field.text.borderColorDisabled;
    borderColorActive = borderColor;
  }

  return `
    width: 100%;
    font-size: 12px;
    letter-spacing: 0.07em;
    padding: ${multiline ? '10' : '0 10'}px;
    height: ${multiline ? 100 : 28}px;
    border-radius: ${props.theme.borderRadius}px;
    transition: border-color ${transition}, color ${transition};
    border: 1px solid ${borderColor};
    color: ${color};
    &:hover,
    &:focus {
      border-color: ${borderColorActive};
    }
    &:-moz-placeholder {
      color: ${placeholderColor};
    }
    &::-webkit-input-placeholder {
      color: ${placeholderColor};
    }
    &::-moz-placeholder {
      color: ${placeholderColor};
    }
    &:-ms-input-placeholder {
      color: $${placeholderColor};
    }
    ${props.theme.mixins.truncateText}
  `;
};

const FieldContainerStyled = styled.div``;

export default class TextField extends Component {

  static propTypes = {
    multiline: PropTypes.bool,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyUp: PropTypes.func,
    onClick: PropTypes.func,
    type: PropTypes.string,
    value: PropTypes.string,
    labelText: PropTypes.string,
    placeholder: PropTypes.string,
    validation: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]),
    capitalize: PropTypes.bool,
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    multiline: false,
    type: 'text',
  };

  constructor(props) {
    super();

    this.state = {
      valid: true,
    };

    this.supportedTypes = ['text', 'email', 'password'];
    this.fieldId = uuid();
    this.FieldStyled = styled[props.multiline ? 'textarea' : 'input']`
      ${p => fieldReadyStyles(p)}
    `;
  }

  componentDidMount() {
    const { value, validation, type } = this.props;

    if (validation && value) {
      this.setState({
        valid: validator(value, validation),
      });
    }

    if (this.supportedTypes.indexOf(type) === -1) {
      throw new Error(`Unsupported TextField type. Support: ${this.supportedTypes.join(', ')}`);
    }
  }

  componentDidUpdate(prevProps) {
    const { fieldNode } = this;
    const { value } = this.props;

    if (prevProps.value !== this.props.value) {
      if (fieldNode.value !== value) {
        fieldNode.value = value;
      }
    }
  }

  onFocusHandler = () => {
    const value = this.getValue();
    const { onFocus } = this.props;
    if (onFocus) onFocus(value);
  };

  onBlurHandler = () => {
    const value = this.getValue();
    const { onBlur } = this.props;
    if (onBlur) onBlur(value);
  };

  onKeyUpHandler = (e) => {
    const { onKeyUp } = this.props;
    if (onKeyUp) onKeyUp(e);
  };

  onChangeHandler = () => {
    const { validation, onChange, name } = this.props;
    const value = this.getValue();
    let valid = true;

    if (value && validation) {
      valid = validator(value, validation);
    }

    this.setState({
      valid,
    });

    if (onChange) {
      onChange(value, valid, name);
    }
  };

  onClickHandler = (e) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(e);
    }
  };

  getValue = () => {
    const { fieldNode } = this;
    const { capitalize } = this.props;
    const value = fieldNode.value;

    if (capitalize) return value.charAt(0).toUpperCase() + value.slice(1);

    return value;
  };

  isValid() {
    return this.state.valid;
  }

  resetValue() {
    const { fieldNode } = this;
    fieldNode.value = '';
  }

  render() {
    const {
      labelText,
      placeholder,
      disabled,
      name,
      type,
      multiline,
      value,
      readOnly,
    } = this.props;
    const { valid } = this.state;

    return (
      <FieldContainerStyled>
        {
          labelText
          ? <FieldLabelStyled htmlFor={this.fieldId}>
            { labelText }
          </FieldLabelStyled>
          : null
        }
        <this.FieldStyled
          innerRef={node => (this.fieldNode = node)}
          tabIndex={0}
          id={this.fieldId}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          defaultValue={value}
          multiline={multiline}
          valid={valid}
          onFocus={this.onFocusHandler}
          onBlur={this.onBlurHandler}
          onChange={this.onChangeHandler}
          onKeyUp={this.onKeyUpHandler}
          onClick={this.onClickHandler}
          readOnly={readOnly}
        />
      </FieldContainerStyled>
    );
  }
}
