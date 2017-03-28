import React, { PropTypes, Component } from 'react';
import uuid from 'uuid';
import styled from 'styled-components';
import { validator } from '../../../../helpers';

const ErrorTextStyled = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  font-size: 12px;
  line-height: 1.1;
  color: ${props => props.theme.field.text.colorInvalid};
  @media ${props => props.theme.media.mobile} {
    top: calc(100% + 3px);
  }
`;

const FieldLabelStyled = styled.label`
  font-size: 12px;
  line-height: 16px;
  display: block;
  width: 100%;
  letter-spacing: 0.04em;
  color: ${props => props.theme.field.text.labelColor};
  margin-bottom: 4px;
`;

const SelectStyled = styled.select`
  ${(props) => {
    const { theme, disabled, valid } = props;
    let color = theme.field.text.color;
    let borderColor = theme.field.text.borderColor;
    let borderColorActive = theme.field.text.borderColorActive;

    if (!valid) {
      borderColor = theme.field.text.borderColorInvalid;
      borderColorActive = borderColor;
    }

    if (disabled) {
      color = theme.field.text.colorDisabled;
      borderColor = theme.field.text.borderColorDisabled;
      borderColorActive = borderColor;
    }
  
    return `
      width: 100%;
      font-size: 12px;
      letter-spacing: 0.07em;
      height: 28px;
      border-radius: ${theme.borderRadius}px;
      transition: border-color ${theme.basicTransition}ms;
      color: ${color};
      background: #ffffff;
      border: 1px solid ${borderColor};
      font-family: inherit;
      appearance: none;
      padding: 0 10px;
      &:hover,
      &:focus {
        border-color: ${borderColorActive};
      }
    `
  }}
`;

const Container = styled.div`
  position: relative;
`;

export default class SelectNative extends Component {

  static propTypes = {
    labelText: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    validation: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]),
    errorText: PropTypes.string,
  };

  static defaultProps = {
    options: [],
  };

  constructor(props) {
    super();
    this.selectId = uuid();

    this.state = {
      selectedValue: props.defaultValue || '',
      valid: true,
    };
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.setState({
        selectedValue: value,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value, defaultValue } = this.props;
    const { selectedValue } = this.state;
    if (value && nextProps.value !== value) {
      this.setState({
        selectedValue: nextProps.value,
      });
    }
    if (defaultValue && (nextProps.defaultValue !== selectedValue)) {
      this.setState({
        selectedValue: defaultValue,
      });
    }
  }

  onChangeHandler = (e) => {
    const { onChange } = this.props;
    const value = e.target.value;

    if (!this.props.value) {
      this.setState({
        selectedValue: value,
      });
    }

    if (onChange) onChange(value);
  };

  onBlurHandler = () => {
    this.validate();
    const { onBlur } = this.props;
    if (onBlur) onBlur();
  };

  validate = () => {
    const valid = this.isValid();

    this.setState({
      valid,
    });
  };

  isValid = () => {
    const { validation } = this.props;
    const value = this.getValue();
    let valid = true;

    if (validation) {
      valid = validator(value, validation);
    }

    return valid;
  };

  getValue = () => {
    return this.state.selectedValue;
  };

  render() {
    const { labelText, placeholder, disabled, options, errorText } = this.props;
    const { selectedValue, valid } = this.state;

    return (
      <Container>
        {
          labelText
            ? <FieldLabelStyled htmlFor={this.fieldId}>
              { labelText }
            </FieldLabelStyled>
            : null
        }
        <SelectStyled
          tabindex={0}
          id={this.selectId}
          disabled={disabled}
          value={selectedValue}
          onChange={this.onChangeHandler}
          onBlur={this.onBlurHandler}
          valid={valid}
        >
          {
            placeholder
              ? <option value="" disabled>
                { placeholder }
              </option>
              : null
          }
          {
            options.map((opt, index) => (
              <option
                key={index}
                value={opt.value}
              >
                { opt.value }
              </option>
            ))
          }
        </SelectStyled>
        {
          errorText && !valid
            ? <ErrorTextStyled>
              { errorText }
            </ErrorTextStyled>
            : null
        }
      </Container>
    );
  }
}
