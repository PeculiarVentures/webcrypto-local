import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';
import { EventChannel } from '../../controllers';

const DescrStyled = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-top: 30px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class RequestCreateErrorDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.state = {
      message: '',
    };

    EventChannel.on('REQUEST_CREATE_ERROR_MESSAGE', this.onSetMessage);
  }

  onSetMessage = (message) => {
    if (message) {
      this.setState({
        message,
      });
    }
  };

  render() {
    const { onAccept } = this.props;
    const { message } = this.state;

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
