import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import TextField from '../text_field';
import SelectDropdown from './select_dropdown';
import { ArrowSelectDownIcon } from '../../../svg';
import { isEqual } from '../../../../helpers';

const ArrowIconStyled = styled(ArrowSelectDownIcon)`
  fill: ${props => props.theme.field.select.iconColor};
  width: 8px;
  position: absolute;
  right: 10px;
  bottom: 10px;
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
        selectedItemData: defaultSelected,
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

  getData = () => {
    return this.state.selectedItemData;
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

  isValid = () => {
    return this.fieldNode.isValid();
  };

  validate = () => {
    this.fieldNode.validate();
  };

  render() {
    const { labelText, placeholder, validation, errorText } = this.props;
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
        />
        <ArrowIconStyled
          opened={opened}
        />
        { this.renderDropdown() }
      </SelectFieldContainerStyled>
    );
    // return (
    //   <SelectFieldContainerStyled>
    //     <SelectNative
    //       placeholder={placeholder}
    //       labelText={labelText}
    //       validation={validation}
    //       errorText={errorText}
    //     />
    //   </SelectFieldContainerStyled>
    // )
  }
}
