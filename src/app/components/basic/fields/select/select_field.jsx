import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import TextField from '../text_field';
import SelectDropdown from './select_dropdown';
import { ArrowSelectDownIcon } from '../../../svg';
import { isEqual } from '../../../../helpers';

const ArrowIconStyled = styled(ArrowSelectDownIcon)`
  fill: rgba(112, 125, 134, 0.5);
  width: 8px;
  position: absolute;
  right: 10px;
  bottom: 12px;
  display: block;
  transform: rotateX(${props => (
    props.opened
    ? 180
    : 0
  )}deg);
`;

const SelectFieldContainerStyled = styled.div`
  position: relative;
  input {
    padding-right: 20px;
  }
`;

export default class SelectField extends Component {

  static propTypes = {
    labelText: PropTypes.string,
    placeholder: PropTypes.string,
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func,
    validation: PropTypes.arrayOf(PropTypes.string),
    errorText: PropTypes.string,
    value: PropTypes.shape({
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
    defaultSelected: PropTypes.shape({
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
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super();

    const defaultSelected = props.defaultSelected;
    this.state = {
      opened: false,
      selectedItemData: {
        value: defaultSelected ? defaultSelected.value : '',
        name: defaultSelected ? defaultSelected.name : '',
        index: defaultSelected ? defaultSelected.index : 0,
      },
    };
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.setState({
        selectedItemData: value,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value, defaultSelected } = this.props;
    const { selectedItemData } = this.state;
    if (value && nextProps.value.index !== value.index) {
      this.setState({
        selectedItemData: nextProps.value,
      });
    }

    if (defaultSelected && !isEqual(nextProps.defaultSelected, selectedItemData)) {
      this.setState({
        selectedItemData: nextProps.defaultSelected,
      });
    }
  }

  onBlurFieldHandler = () => {
    setTimeout(() => {
      this.setState({
        opened: false,
      });
    }, 100);
  };

  onClickFieldHandler = () => {
    const { opened } = this.state;
    this.setState({
      opened: !opened,
    });
  };

  onKeyUpFieldhandler = (e) => {
    const keyCode = e.keyCode;
    const { opened } = this.state;

    if (keyCode === 13 && !opened) {
      this.setState({
        opened: true,
      });
    }
  };

  onChangeHandler = (data, close) => {
    const { onChange, value } = this.props;

    if (!value) {
      this.setState({
        selectedItemData: data,
      });
    }

    if (onChange) onChange(data);

    if (close) {
      this.onBlurFieldHandler();
    }
  };

  getData = () => (
    this.state.selectedItemData
  );

  isValid = () => (
    this.fieldNode.isValid()
  );

  validate = () => {
    this.fieldNode.validate();
  };

  renderDropdown() {
    const { children } = this.props;
    const { opened, selectedItemData } = this.state;

    if (opened) {
      return (
        <SelectDropdown
          selectedItemData={selectedItemData}
          onChange={this.onChangeHandler}
        >
          { children }
        </SelectDropdown>
      );
    }

    return null;
  }

  render() {
    const { labelText, placeholder, validation, errorText, disabled } = this.props;
    const { opened, selectedItemData } = this.state;

    return (
      <SelectFieldContainerStyled>
        <TextField
          labelText={labelText}
          placeholder={placeholder}
          value={selectedItemData.name}
          readOnly
          onBlur={this.onBlurFieldHandler}
          onClick={this.onClickFieldHandler}
          onKeyUp={this.onKeyUpFieldhandler}
          validation={validation}
          errorText={errorText}
          ref={node => (this.fieldNode = node)}
          disabled={disabled}
        />
        <ArrowIconStyled
          opened={opened}
        />
        { this.renderDropdown() }
      </SelectFieldContainerStyled>
    );
  }
}
