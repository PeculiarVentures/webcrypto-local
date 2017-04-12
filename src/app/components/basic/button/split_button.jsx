import React, { PropTypes, Component } from 'react';
import * as SplitButtonStyled from './styled/split_button.styled';

export default class SplitButton extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    disabled: PropTypes.bool,
    list: PropTypes.arrayOf(PropTypes.string),
    onSelect: PropTypes.func,
  };

  static defaultProps = {
    primary: false,
    secondary: false,
    disabled: false,
    list: [],
    onSelect: null,
  };

  constructor() {
    super();

    this.state = {
      open: false,
    };
  }

  onArrowClickHandler = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  onArrowBlurHandler = () => {
    setTimeout(() => {
      this.setState({
        open: false,
      });
    }, 150);
  };

  onItemClickHandler = (value) => {
    const { onSelect } = this.props;
    if (onSelect) onSelect(value);
  };

  render() {
    const {
      children,
      primary,
      secondary,
      disabled,
      list,
    } = this.props;
    const { open } = this.state;

    return (
      <SplitButtonStyled.Container>
        <SplitButtonStyled.Btn
          {...this.props}
        >
          { children }
        </SplitButtonStyled.Btn>
        <SplitButtonStyled.ArrowBtnContainer>
          <SplitButtonStyled.ArrowBtn
            primary={primary}
            secondary={secondary}
            disabled={disabled}
            onClick={this.onArrowClickHandler}
            onBlur={this.onArrowBlurHandler}
          >
            <SplitButtonStyled.ArrowIcon />
          </SplitButtonStyled.ArrowBtn>
          {
            open && list.length
              ? <SplitButtonStyled.DropdownWrapper>
                <SplitButtonStyled.DropdownContainer>
                  {
                    list.map((item, index) => (
                      <SplitButtonStyled.Item
                        onClick={() => this.onItemClickHandler(item)}
                        key={index}
                      >
                        { item }
                      </SplitButtonStyled.Item>
                    ))
                  }
                </SplitButtonStyled.DropdownContainer>
              </SplitButtonStyled.DropdownWrapper>
              : null
          }
        </SplitButtonStyled.ArrowBtnContainer>
      </SplitButtonStyled.Container>
    );
  }
}
