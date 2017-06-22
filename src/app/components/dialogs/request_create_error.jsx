import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';

const DescrStyled = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-top: 30px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class RequestCreateErrorDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    message: PropTypes.string,
  };

  render() {
    const { onAccept, message } = this.props;

    return (
      <Dialog
        title={enLang['Dialog.RequestCreateError.Title']}
        acceptText={enLang['Dialog.RequestCreateError.Btn.Accept']}
        cancelText=""
        onAccept={onAccept}
      >
        <DescrStyled>
          { message }
        </DescrStyled>
      </Dialog>
    );
  }
}
