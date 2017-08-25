import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';

const NumberStyled = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 30px;
  line-height: 40px;
  background: rgba(242, 243, 244, .6);
  border-radius: ${props => props.theme.borderRadius}px;
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
  color: ${props => props.theme.dialog.color};
  &:first-child {
    margin-left: 0;
  }
`;

const NumbersContainerStyled = styled.div`
  margin-top: 53px;
  text-align: center;
`;

const DescrStyled = styled.div`
  font-size: 13px;
  line-height: 18px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class FortifyAuthorizationDialog extends Component {

  static propTypes = {
    message: PropTypes.string,
  };

  static defaultProps = {
    message: '',
  };

  render() {
    const { message } = this.props;

    return (
      <Dialog
        title={''}
        acceptText={''}
        cancelText={''}
      >
        <DescrStyled>
          { enLang['Dialog.FortifyAuthorization.Description'] }
        </DescrStyled>
        <NumbersContainerStyled>
          {
            message.split('').map((number, index) => (
              <NumberStyled
                key={index}
              >
                { number }
              </NumberStyled>
            ))
          }
        </NumbersContainerStyled>
      </Dialog>
    );
  }
}
