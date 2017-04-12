import React, { Component } from 'react';
import styled from 'styled-components';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';

const DescrStyled = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-top: 30px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class NotSupportedLocalhostDialog extends Component {

  render() {
    return (
      <Dialog
        title={enLang['Dialog.NotSupportedLocalhost.Title']}
        acceptText=""
        cancelText=""
      >
        <DescrStyled>
          { enLang['Dialog.NotSupportedLocalhost.Description'] }
        </DescrStyled>
      </Dialog>
    );
  }
}
